# 猫武士数学森林 · 学习系统设计

> 自适应难度 · AI 错题本 · 薄弱点微课 · 年级打卡 · 模块规划
> 本文档在 `DESIGN.md` 之上,补全"个性化学习闭环",对接香港小学数学课程纲要与优秀学校难度。

---

## 0. 现状盘点(哪些已有、哪些缺)

| 能力 | 现状 | 缺口 |
|------|------|------|
| 账号数据独立 + 云同步 | ✅ `user_data` 按 `user_id` 隔离,`cloudPull/Push` 整包 JSON | 整包 last-write-wins,多设备并发丢数据;错题量大 JSON 膨胀 |
| 题目覆盖 P3–P6 | ✅ 12 领地 × 全知识点,几十个 `gen*` | 缺"课程纲要条目"标注、缺变式题库、缺拔高/竞赛档 |
| 会话内自适应难度 | ✅ 连对2题 tier+1、连错3题 tier-1,`setGenTier` 已接入 | 无跨会话学习画像、无跨天调整 |
| 年级映射 | ✅ `region.season`(1=P3-4,2=P5,3=P6) | 打卡不按年级、不按薄弱点 |
| 打卡 streak | ✅ `daily`(3 固定任务)+ `streak` | 任务全局固定、不分类、不含错题重温 |
| 错题本 | ❌ 答错只 `audio.wrong()`,不记录 | 全缺 |
| AI 归类总结 | ❌ | 全缺 |
| 薄弱点诊断 + 微课 | ❌(`mastered` 只用于去重) | 全缺 |

---

## 1. 数据架构(独立 + 同步 + 可分析)

### 1.1 账号数据独立与同步(确认 + 改进)

- **确认**:每个账号数据独立(`user_id` 隔离),积分/猎物/卡片/徽章/进度/设置都随账号走,登录即同步。✅
- **改进方向**:把"高频、结构化、需要分析"的数据从整包 JSON 里拆出来,存独立 D1 表;低频游戏状态继续用 JSON。
  - 结构化表:增量同步、可查询、可喂给 AI、不膨胀 JSON。
  - JSON blob:保留 `points/prey/cards/badges/settings`,继续 last-write-wins(体积小,冲突概率低)。

### 1.2 新增 D1 表(在 `schema/schema.sql` 追加)

```sql
-- 答题记录(每次答题一行,错题本的原始数据)
CREATE TABLE IF NOT EXISTS attempts (
  id          TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL,
  level_id    TEXT NOT NULL,
  region      TEXT NOT NULL,
  season      INTEGER NOT NULL,      -- 年级:1=P3-4,2=P5,3=P6
  kp          TEXT NOT NULL,         -- 知识点 key,如 "frac_add_diff"
  q_key       TEXT NOT NULL,         -- 题目指纹(题型+参数哈希),用于去重/重现
  correct     INTEGER NOT NULL,      -- 0/1
  user_answer TEXT,
  correct_answer TEXT,
  tier        INTEGER,               -- 答题时的难度档 0/1/2
  duration_ms INTEGER,
  created_at  TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_attempts_user_kp ON attempts(user_id, kp);
CREATE INDEX IF NOT EXISTS idx_attempts_user_time ON attempts(user_id, created_at);

-- 错题本(错题的间隔重复队列,由 attempts 派生)
CREATE TABLE IF NOT EXISTS mistakes (
  user_id        TEXT NOT NULL,
  q_key          TEXT NOT NULL,
  level_id       TEXT NOT NULL,
  kp             TEXT NOT NULL,
  error_type     TEXT,               -- calc/concept/reading/method
  wrong_count    INTEGER DEFAULT 1,
  last_wrong_at  TEXT NOT NULL,
  next_review_at TEXT NOT NULL,      -- 1/3/7/21 天间隔重复
  mastered       INTEGER DEFAULT 0,
  PRIMARY KEY (user_id, q_key)
);

-- 学习画像 / 薄弱点(按知识点聚合,可由 AI 刷新)
CREATE TABLE IF NOT EXISTS weak_points (
  user_id      TEXT NOT NULL,
  kp           TEXT NOT NULL,
  season       INTEGER,
  attempts     INTEGER DEFAULT 0,
  correct      INTEGER DEFAULT 0,
  mastery_rate REAL DEFAULT 0,       -- 加权正确率,近期权重高
  avg_duration_ms INTEGER,
  trend        TEXT,                 -- up/flat/down
  ai_summary   TEXT,                 -- AI 归类总结(缓存)
  ai_updated_at TEXT,
  last_updated TEXT NOT NULL,
  PRIMARY KEY (user_id, kp)
);

-- 每日打卡记录(按年级)
CREATE TABLE IF NOT EXISTS daily_checkin (
  user_id  TEXT NOT NULL,
  date     TEXT NOT NULL,            -- YYYY-MM-DD
  season   INTEGER NOT NULL,
  plan     TEXT NOT NULL,            -- JSON:今日题目编排
  progress TEXT NOT NULL,            -- JSON:完成情况
  streak_count INTEGER,
  PRIMARY KEY (user_id, date)
);

-- 微课内容(全局,非用户隔离)
CREATE TABLE IF NOT EXISTS courses (
  id        TEXT PRIMARY KEY,
  kp        TEXT NOT NULL,           -- 对应薄弱知识点
  season    INTEGER,
  title_en  TEXT, title_zh TEXT,
  cpa_steps TEXT NOT NULL,           -- JSON:具象→图像→抽象
  practice_level_id TEXT,            -- 学完推荐的练习关卡
  created_at TEXT
);
```

### 1.3 前端 `state` 扩展(本地缓存,离线可用)

```js
state.profile.grade      // 当前年级 season(1/2/3),首次进入选择
state.profile.targetDiff // 目标难度倾向
state.attemptsCache      // 最近 N 条答题(离线暂存,上线同步)
state.mistakesMirror     // 错题本本地镜像(离线打卡可取错题重温)
state.weakPoints         // 薄弱点缓存(渲染仪表盘用)
```

---

## 2. 课程体系:对齐香港课程纲要 + 优秀学校拔高

### 2.1 香港小學數學課程(EDB 綱要)P3–P6 对照

| 年级 | 课程纲要核心学习重點 | 对应领地(season) |
|------|----------------------|-------------------|
| P3 | 四位運算、分數初步、周界、立體圖形初步、統計圖 | season 1(mixed / 部分 spatial) |
| P4 | 四則混合運算、小數、面積、角度、對稱 | season 1(mixed / decimal / geometry / spatial) |
| P5 | 分數運算、百分數、比、體積、圓周界(入門) | season 2(fraction / percent / ratio / geo2) |
| P6 | 百分數應用、速率、對稱/變換、圓面積、統計平均數 | season 3(stats / circle)+ 拔高 |

> 注:香港 P6 正式课程不教负数/代数方程,但优秀学校(聖保羅男女、喇沙、拔萃等)拔高与面试题会涉及。这些放进 **season 3 的"星族挑战"扩展区**,标为 `schoolTier=challenge`,不强制。

### 2.2 `LEVELS` 字段扩展(在 `i18n.js`)

每关增加课程标注,便于诊断与推荐:

```js
{ id:"f4", region:"fraction", diff:3, gen:"frac_add_diff",
  curriculum:"P5-N3 異分母分數加減",   // 课程纲要条目
  schoolTier:"advanced",               // foundation / standard / advanced / challenge
  variations:4,                         // 可生成的变式数
  kp:"frac_add_diff",                   // 知识点 key(与 gen 对齐)
  icon:"🦝", en:"...", zh:"異分母加減" }
```

- `diff 1` = 基礎(纲要要求) · `diff 2` = 鞏固(標準) · `diff 3` = 拔高(优秀学校测验) · `diff 4` = 挑戰(竞赛/变式)
- `schoolTier` 用于按学校目标筛选难度档位。

### 2.3 变式题库

`gen*` 增加 `variation` 参数,每个知识点产出多变式:数值变化、情境变化、逆向题、易错陷阱题。避免"背答案",支撑间隔重复(重现同知识点不同变式)。

---

## 3. 自适应难度引擎(三层)

### 3.1 三层自适应

| 层级 | 触发 | 机制 | 状态 |
|------|------|------|------|
| 会话内 | 每题 | 连对2题 tier+1,连错3题 tier-1 | ✅ 已有 |
| 跨会话 | 进入关卡 | 初始 tier = f(该知识点 masteryRate) | 🆕 |
| 跨天 | 每日首题 | 参考昨日整体表现 + 今日薄弱点 | 🆕 |

### 3.2 学习画像(per-knowledge-point)

```
masteryRate = Σ(近期正确 × 时间衰减权重) / Σ(权重)
画像字段:attempts / correct / masteryRate / avgDuration / trend
```

- 初始难度:`masteryRate ≥ 85%` → tier 2;`60–85%` → tier 1;`< 60%` → tier 0 + 推微课。
- 目标区间:把正确率稳定在 **70–85%**(最近发展区)。低于 60% 降档+推微课,高于 90% 升档+解锁变式/挑战。

### 3.3 落点

- 新建 `js/learning.js`:画像计算、初始难度决策、薄弱点诊断。
- `engine.js` 的 `gen*` 增加 `variation` 与 `tier` 入参。

---

## 4. AI 错题本

### 4.1 错题记录

`gradeCurrent` 答错时,写 `attempts`(并 upsert `mistakes`)。字段含题目快照、用户答案、正确答案、知识点、错误类型。

错误类型自动初判:
- `calc` 计算错(步骤对、最后算错)
- `concept` 概念错(如通分遗漏)
- `reading` 审题错(单位/问法误读)
- `method` 方法错(用错运算)

### 4.2 AI 归类总结(`functions/api/ai-summary.js`)

- **触发**:累计满 N 道新错题,或每周日自动;也可手动"让导师分析"。
- **输入**(脱敏):近期错题的知识点、题型、错误模式(不送可识别个人信息)。
- **模型**:Cloudflare Workers AI(`@cf/meta/llama-3.1-8b-instruct`,免费额度)或 OpenAI(`gpt-4o-mini`)。
- **输出**:
  - 错因归类(如"異分母通分時未找最小公倍數""運算順序混淆")。
  - 薄弱知识点 Top 3 排序。
  - 一句话导师点评(猫武士口吻)。
  - 推荐练习关卡 ID。
- **缓存**:写入 `weak_points.ai_summary`,周更,降低成本。

### 4.3 间隔重复(Spaced Repetition)

错题进队列,`next_review_at = +1 / +3 / +7 / +21 天`。每日打卡"错题重温"取 due 题目,**出同知识点的新变式**(非原题),避免背答案。连续两次答对 → 移出队列;答错 → 重置队列。

### 4.4 在打卡中体现

每日打卡题目构成 = 新知推进 + 1–2 道错题重现(变式) + 1 道薄弱点巩固。让"昨天错的知识"第二天就回来。

---

## 5. 薄弱知识点微课

### 5.1 诊断

基于 `attempts` 计算每知识点 `masteryRate`,`< 70%` 标记薄弱,进 `weak_points` 表。

### 5.2 微课内容(CPA)

每个薄弱知识点配一节微课,存 `courses` 表:
1. **具象 Concrete**:SVG/动画直观演示(如两个不同分母的饼图,看到"要统一大小才能相加")。
2. **图像 Pictorial**:通分过程图示。
3. **抽象 Abstract**:列出算式与公式。
4. **引导题**:1–2 道带提示的引导题,做对即解锁"巩固狩猎"。

### 5.3 学习闭环

```
诊断薄弱点 → 推微课 → 学完解锁基础关卡 → 练习 → 再诊断(masteryRate 更新)
```

打通"测 → 学 → 练 → 测",薄弱点 masteryRate 回升后自动退出推荐。

---

## 6. 打卡系统升级(按年级)

### 6.1 年级选择

- 首次进入选年级(P3/P4/P5/P6),写入 `state.profile.grade` → `season`。
- 打卡内容锁定在该年级范围(可跨年级复习,但主任务按年级)。
- 切换年级需确认(避免刷分),并保留历史 streak。

### 6.2 每日打卡结构(分年级,自适应)

```
基础狩猎  : 本年级当日知识点 5 题(新知/巩固,初始难度按画像)
错题重温  : 2 题(变式,来自间隔重复队列)
挑战题    : 1 题(拔高/竞赛,可选,答错不扣 streak)
```

- **P3–P4**:偏四则、小数、几何基础。
- **P5**:偏分数、百分数、比、体积。
- **P6**:偏百分数应用、速率、圆、统计 + 星族挑战扩展。

任务难度根据该孩子学习画像调整(薄弱点偏基础,强项偏拔高)。

### 6.3 奖励阶梯

- 每日完成:猎物 + 积分 + streak + 概率掉落随机猫咪卡。
- streak 里程碑:7 天 / 30 天 / 100 天 → 解锁专属猫咪卡 + 限定头衔。
- 连续答对 / 全对:额外"完美狩猎"奖励 + 音效。

---

## 7. 模块划分

### 前端(新增 / 拆分)

| 文件 | 职责 |
|------|------|
| `js/learning.js`(新) | 学习画像、初始难度决策、薄弱点诊断、最近发展区控制 |
| `js/mistakes.js`(新) | 错题本管理、间隔重复队列、错误类型初判 |
| `js/checkin.js`(新) | 年级打卡会话编排(替代 `ui.js` 部分 daily 逻辑) |
| `js/courses.js`(新) | 微课渲染(CPA 步骤 + 引导题) |
| `js/engine.js` | 保留 `gen*` + grader;增加 `variation`/`tier` 入参;`gradeCurrent` 接错题记录 |
| `js/i18n.js` | `LEVELS` 增加 `curriculum/schoolTier/variations/kp`;新增微课 i18n |
| `js/ui.js` | 新增:错题本页、薄弱点仪表盘、微课页、年级选择页 |
| `js/auth.js` | 同步扩展:结构化数据增量拉取 |

### 后端(`functions/api/` 新增)

| 文件 | 职责 |
|------|------|
| `attempts.js` | `GET` 记录 / `POST` 记录答题(并 upsert mistakes/weak_points) |
| `mistakes.js` | `GET` 错题本 + due 复习题 |
| `ai-summary.js` | `POST` 触发 AI 归类(Workers AI / OpenAI) |
| `weak-points.js` | `GET` 薄弱点诊断 |
| `courses.js` | `GET` 微课内容 |
| `checkin.js` | `GET` 今日打卡编排 / `POST` 打卡结果 |

### 数据库

`schema/schema.sql` 追加上述 5 张表 + 索引;写迁移脚本 `schema/migrate.sql`。

---

## 8. 落地路线图(分阶段,可独立交付)

| 阶段 | 内容 | 产出 | 依赖 |
|------|------|------|------|
| **A** | 数据层:schema 扩展 + `attempts` 写入 | 答题即落库,有数据可分析 | — |
| **B** | 错题本 UI + 间隔重复(本地优先) | 孩子能看到错题、每日重温 | A |
| **C** | 学习画像 + 跨会话自适应初始难度 | 进关卡难度贴合水平 | A |
| **D** | 年级打卡重构(分年级 + 错题编入) | 打卡按年级、含错题重现 | B、C |
| **E** | AI 错题归类总结 | 导师点评 + 薄弱点排序 | A |
| **F** | 薄弱点微课(CPA)+ 诊断推荐闭环 | 测→学→练→测闭环 | C、E |
| **G** | 难度校准:对照香港纲要 + 优秀学校真题调 `gen*` 参数与变式 | 难度真正对齐 | 全量数据 |

> 建议起步:**A → D**(数据层 + 年级打卡)最能直接解决"打卡不分年级、错题不记录"的当下痛点;E(AI)和 F(微课)在数据攒起来后接。

---

## 9. 风险与注意事项

- **AI 成本/隐私**:优先 Workers AI(免费额度);只送题目/答案/知识点,不送可识别信息;`ai_summary` 缓存周更。
- **同步冲突**:结构化表用 `updated_at` 增量拉取;JSON blob 体积小、保留 last-write-wins。
- **离线**:错题/打卡本地缓存,上线后同步;新微课内容需预缓存(`sw.js` ASSETS 或按需缓存)。
- **难度校准**:需真实学生数据迭代,初期靠纲要+学校真题人工标定,后期用 masteryRate 分布自动调档。
- **儿童体验**:所有 AI 文案需儿童友好、猫武士口吻;挑战题答错不惩罚 streak,保护成就感。

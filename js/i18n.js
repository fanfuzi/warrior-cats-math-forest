/* Warrior Cats Math Forest - i18n + game data (ranks, prey, regions, levels, mentors, badges) */
window.WCM = window.WCM || {};
WCM.lang = 'en';

WCM.I18N = {
  en: {
    appTitle:"Warrior Cats Math Forest", subtitle:"ThunderClan · Hunt to Grow Strong",
    storyIntro:"You are a young cat of ThunderClan. Train across the four territories of the forest, hunt prey by solving math challenges, and grow from kit to clan leader!",
    play:"Enter the Forest", settings:"Settings", back:"Back", home:"Camp", next:"Next",
    submit:"Submit", clear:"Clear", del:"⌫", hint:"Hint", showSolution:"See Solution",
    retry:"Try Again", replay:"Hunt Again", rank:"Rank", points:"Points", freshkill:"Fresh-kill Pile",
    yourRank:"Your Rank", chooseLevel:"Choose Your Hunt", randomHunt:"Random Hunt",
    difficulty:"Difficulty", tier1:"Foundation", tier2:"Intermediate", tier3:"Challenge", tier4:"Assessment", question:"Question", of:"of", score:"Prey Caught",
    adaptEasy:"Easing", adaptNormal:"Steady", adaptHard:"Challenge",
    lockLevel:"Clear the previous level to unlock", lockBoss:"Clear all levels to unlock the assessment",
    correct:"Correct!", wrong:"The prey escaped!", correctAnswer:"Correct answer",
    solution:"Solution", levelComplete:"Hunt Complete", rankUp:"Rank Up!",
    newRank:"You are now a", language:"Language", sound:"Sound", on:"On", off:"Off",
    en:"English", "zh-TW":"繁體中文", starsEarned:"Stars Earned", pointsGained:"Points Gained", completeBonus:"Completion Bonus",
    noStars:"Keep training, warrior!",
    mistakeBook:"Mistake Book", reviewTitle:"Mistake Review", startReview:"Start Review Hunt",
    noMistakes:"No mistakes to review - great job!", dueNow:"Due", yourAnswer:"Your answer", cardAlbum:"Card Album", weakPoints:"Weak Points", mastery:"Mastery", gradeSelect:"Select Your Grade", grade1:"P3-P4 Forest Beginnings", grade2:"P5 Deep Forest", grade3:"P6 Path to StarClan", dailyCheckin:"Daily Hunt", dailyHuntBtn:"Start Daily Hunt", yourGrade:"Grade", aiAnalyze:"AI Mentor Analysis", aiAnalyzing:"Analyzing...", aiNotConfigured:"AI not configured yet", aiLoginRequired:"Please log in to use AI analysis.", aiLoginBtn:"Log In", aiNoData:"Not enough data yet - answer a few questions first!", microLesson:"Micro-lesson", courseRec:"Recommended Micro-lessons", courseLabel:"Micro-lesson", startGuided:"Start Guided Practice", courseHunt:"Consolidation Hunt", courseDone:"Lesson Complete!", courseHint:"Read the steps, then hunt to master it!", cpConcrete:"Concrete", cpPictorial:"Pictorial", cpAbstract:"Abstract", unlockStars:"Earn {need}★ to unlock ({have}/{need})", tierLadder:"Difficulty ladder",
    territories:"Forest Territories", chooseTerritory:"Choose a Territory",
    mentor:"Mentor", badges:"Badges", badgeEarned:"Badge Earned!",
    noBadges:"Complete a territory assessment to earn badges.",
    /* math terms */
    add:"add", subtract:"subtract", multiply:"multiply", divide:"divide",
    parenthesesFirst:"parentheses first", then:"then", equals:"=", first:"First", step:"Step",
    "+":"add", "-":"subtract", "×":"multiply", "÷":"divide",
    /* geometry terms */
    acute:"Acute", rightAngle:"Right", obtuse:"Obtuse",
    parallel:"Parallel", perpendicular:"Perpendicular", intersecting:"Intersecting",
    face:"face", edge:"edge", vertex:"vertex", faces:"faces", edges:"edges", vertices:"vertices",
    perimeter:"Perimeter", area:"Area", volume:"Volume",
    cube:"Cube", cuboid:"Cuboid", cylinder:"Cylinder", cone:"Cone",
    sphere:"Sphere", prism:"Triangular Prism", pyramid:"Square Pyramid",
    triangle:"Triangle", rectangle:"Rectangle", square:"Square", circle:"Circle",
    pentagon:"Pentagon", hexagon:"Hexagon", parallelogram:"Parallelogram",
    trapezium:"Trapezium", rhombus:"Rhombus",
    tenths:"tenths", hundredths:"hundredths", tenthsPlace:"tenths place", hundredthsPlace:"hundredths place",
    whatShape:"What shape is this?", whatShape3d:"What 3D shape is this?",
    whatAngle:"What type of angle is this?", whatLines:"What type of lines are these?",
    whichNet:"Which 3D shape does this net make?",
    findPerimeter:"Find the perimeter", findArea:"Find the area", findVolume:"Find the volume",
    howManyCubes:"How many small cubes?", howManyFaces:"How many faces does this have?",
    howManyEdges:"How many edges does this have?", howManyVertices:"How many vertices does this have?",
    whichLargest:"Which is the largest?", whichSmallest:"Which is the smallest?",
    compareFill:"Compare: fill in >, < or =",
    whatValue:"What is the value of the digit",
    in_the_number:"in the number",
    /* feedback */
    praise1:"Fine catch!", praise2:"Swift paws!", praise3:"Like a true warrior!",
    praise4:"Excellent!", praise5:"The Clan is proud!",
    /* regions */
    region_mixed:"Hunting Grounds", region_mixed_topic:"Mixed Operations",
    region_mixed_desc:"Train the four operations, order of operations, parentheses and word problems.",
    region_decimal:"Stream Fishery", region_decimal_topic:"Decimals",
    region_decimal_desc:"Master decimal place value, comparison, and the four operations with decimals.",
    region_geometry:"Ancient Tree Camp", region_geometry_topic:"2D Geometry",
    region_geometry_desc:"Identify shapes, angles, lines, and calculate perimeter and area.",
    region_spatial:"Highland Rocks", region_spatial_topic:"3D & Spatial",
    region_spatial_desc:"Recognize 3D shapes, nets, count faces and edges, and calculate volume.",
    /* level descriptions */
    lvlDesc_m1:"Add, subtract, multiply and divide with bigger numbers.",
    lvlDesc_m2:"Multiply and divide before add and subtract.",
    lvlDesc_m3:"Whatever is in parentheses comes first.",
    lvlDesc_m4:"Two steps in one expression.",
    lvlDesc_m5:"Solve real Clan hunting problems.",
    lvlDesc_m6:"Use associative & distributive laws to compute smartly.",
    lvlDesc_m7:"Find errors and estimate to check your work.",
    lvlDesc_m8:"Multi-digit operation laws, word problems and thinking puzzles.",
    lvlDesc_mboss:"Prove you are ready to be a warrior.",
    lvlDesc_d1:"Identify the tenths and hundredths places.",
    lvlDesc_d2:"Compare and order decimal numbers.",
    lvlDesc_d3:"Add decimals with 1-2 decimal places.",
    lvlDesc_d4:"Subtract decimals with 1-2 decimal places.",
    lvlDesc_d5:"Multiply decimals by whole numbers.",
    lvlDesc_dboss:"Master all decimal operations.", lvlDesc_d6:"Real-world decimal problems (incl. multiplication).", lvlDesc_gword:"Apply perimeter & area to camp tasks.", lvlDesc_sword:"Real-world volume & cube-count problems.",
    lvlDesc_g1:"Identify 2D shapes by their properties.",
    lvlDesc_g2:"Recognize acute, right and obtuse angles.",
    lvlDesc_g3:"Calculate perimeters of rectangles and squares.",
    lvlDesc_g4:"Calculate areas of rectangles and squares.",
    lvlDesc_g5:"Identify parallel and perpendicular lines.",
    lvlDesc_gboss:"Master all geometry skills.",
    lvlDesc_s1:"Identify cubes, cylinders, cones, spheres and more.",
    lvlDesc_s2:"Count faces, edges and vertices of 3D shapes.",
    lvlDesc_s3:"Match nets to their 3D shapes.",
    lvlDesc_s4:"Calculate volumes of cuboids.",
    lvlDesc_s5:"Count cubes in 3D arrangements.",
    lvlDesc_sboss:"Conquer all spatial challenges.",
    bossLabel:"Assessment", startHunt:"Start Hunt", bestStars:"Best", lockedSoon:"Train more to grow",
    /* decimal feedback */
    decHint_add:"Line up the decimal points, then add column by column.",
    decHint_sub:"Line up the decimal points, then subtract column by column.",
    decHint_mul:"Multiply as whole numbers, then count decimal places.",
    decHint_place:"The first digit after the decimal point is tenths, the second is hundredths.",
    decHint_compare:"Compare digit by digit from left to right.",
    /* geometry feedback */
    geoHint_shape:"Count the sides and look at the angles.",
    geoHint_angle:"Less than 90° is acute, exactly 90° is right, more than 90° but less than 180° is obtuse.",
    geoHint_perimeter:"Perimeter = sum of all sides. For a rectangle: (length + width) × 2.",
    geoHint_area:"Area of a rectangle = length × width.",
    geoHint_lines:"Parallel lines never meet. Perpendicular lines meet at a right angle.",
    /* spatial feedback */
    spHint_shape:"Look at the faces: flat, curved, triangular, or square?",
    spHint_props:"A cube has 6 faces, 12 edges and 8 vertices.",
    spHint_net:"Imagine folding the net up into a 3D shape.",
    spHint_volume:"Volume = length × width × height.",
    spHint_count:"Count layer by layer, including hidden cubes.",
    /* ---- P5: Fractions ---- */
    fraction:"Fraction", numerator:"Numerator", denominator:"Denominator",
    equivalentFraction:"Equivalent", simplify:"Simplify", expand:"Expand",
    mixedNumber:"Mixed Number", improperFraction:"Improper Fraction", lowestTerms:"Lowest Terms",
    findEquivalent:"Find the equivalent fraction", simplifyFraction:"Simplify the fraction",
    fracAdd:"Add the fractions", fracSub:"Subtract the fractions",
    fracMulInt:"Multiply the fraction", fracDivInt:"Divide the fraction",
    lvlDesc_f1:"Find equivalent fractions using pictures and numbers.",
    lvlDesc_f2:"Simplify fractions to lowest terms.",
    lvlDesc_f3:"Add and subtract fractions with the same denominator.",
    lvlDesc_f4:"Add and subtract fractions with different denominators.",
    lvlDesc_f5:"Multiply and divide fractions by whole numbers.",
    lvlDesc_fboss:"Master all fraction operations.",
    fracHint_equivalent:"Multiply or divide both top and bottom by the same number.",
    fracHint_simplify:"Divide numerator and denominator by their greatest common factor.",
    fracHint_add_same:"Add the numerators, keep the denominator the same.",
    fracHint_add_diff:"Find a common denominator first, then add.",
    fracHint_mul:"Multiply the numerator by the whole number.",
    fracHint_div:"Divide by a whole number = multiply by its reciprocal.",
    /* ---- P5: Percentages ---- */
    percent:"Percent", percentMeaning:"Percent means out of 100",
    discount:"Discount", profit:"Profit", originalPrice:"Original Price",
    convertToPercent:"Convert to a percent", findPercent:"Find the percentage",
    percentIncrease:"Percentage increase", percentDecrease:"Percentage decrease",
    lvlDesc_p1:"Understand percent as out of 100.",
    lvlDesc_p2:"Convert between fractions, decimals and percents.",
    lvlDesc_p3:"Find what percent one number is of another.",
    lvlDesc_p4:"Calculate percentage increase and decrease.",
    lvlDesc_p5:"Solve discount and profit problems.",
    lvlDesc_pboss:"Master all percentage operations.",
    pctHint_meaning:"Percent means per hundred. 25% = 25 out of 100.",
    pctHint_convert:"To convert a decimal to percent, multiply by 100.",
    pctHint_find:"Divide the part by the whole, then multiply by 100.",
    pctHint_change:"Find the difference, divide by the original, multiply by 100.",
    pctHint_discount:"Discount = Original Price × (1 - discount rate).",
    /* ---- P5: Ratio ---- */
    ratio:"Ratio", ratioColon:":", directProportion:"Direct Proportion",
    inverseProportion:"Inverse Proportion", shareByRatio:"Share by ratio",
    simplifyRatio:"Simplify the ratio", divideByRatio:"Divide by the ratio",
    lvlDesc_r1:"Understand ratio as comparing quantities.",
    lvlDesc_r2:"Simplify ratios to lowest terms.",
    lvlDesc_r3:"Divide a quantity in a given ratio.",
    lvlDesc_r4:"Solve direct proportion problems.",
    lvlDesc_r5:"Solve inverse proportion problems.",
    lvlDesc_rboss:"Master all ratio and proportion skills.",
    ratioHint_meaning:"A ratio compares two quantities, like 3:2.",
    ratioHint_simplify:"Divide both numbers by their greatest common factor.",
    ratioHint_share:"Add the ratio parts, find one part, then multiply.",
    ratioHint_direct:"If one goes up, the other goes up by the same factor.",
    ratioHint_inverse:"If one goes up, the other goes down.",
    /* ---- P5: Advanced Geometry ---- */
    triangleArea:"Triangle Area", parallelogramArea:"Parallelogram Area",
    trapeziumArea:"Trapezium Area", angleSum:"Angle Sum",
    compositeShape:"Composite Shape", base:"Base", height:"Height",
    findTriangleArea:"Find the triangle area", findParallelogramArea:"Find the parallelogram area",
    findTrapeziumArea:"Find the trapezium area", findMissingAngle:"Find the missing angle",
    findCompositeArea:"Find the total area",
    lvlDesc_g6:"Calculate the area of triangles.",
    lvlDesc_g7:"Calculate the area of parallelograms.",
    lvlDesc_g8:"Calculate the area of trapeziums.",
    lvlDesc_g9:"Find missing angles using the angle sum of a triangle.",
    lvlDesc_g10:"Find areas of composite shapes.",
    lvlDesc_g2boss:"Master all advanced geometry skills.",
    geo2Hint_triangle:"Triangle area = base × height ÷ 2.",
    geo2Hint_parallelogram:"Parallelogram area = base × height.",
    geo2Hint_trapezium:"Trapezium area = (top + bottom) × height ÷ 2.",
    geo2Hint_angle:"Angles in a triangle add up to 180°.",
    geo2Hint_composite:"Split the shape into rectangles and triangles.",
    /* ---- P6: Negative Numbers ---- */
    negative:"Negative", positive:"Positive", numberLine:"Number Line",
    temperature:"Temperature", aboveZero:"above zero", belowZero:"below zero",
    lvlDesc_n1:"Understand positive and negative numbers.",
    lvlDesc_n2:"Compare and order numbers on a number line.",
    lvlDesc_n3:"Add and subtract with negative numbers.",
    lvlDesc_n4:"Solve temperature and elevation word problems.",
    lvlDesc_nboss:"Master all negative number skills.",
    negHint_intro:"Numbers below zero are negative, like -3. Above zero are positive.",
    negHint_compare:"On a number line, right means bigger. -2 is bigger than -5.",
    negHint_add:"Adding a positive moves right. Adding a negative moves left.",
    negHint_word:"Find the direction and amount of change, then add or subtract.",
    /* ---- P6: Algebra ---- */
    variable:"Variable", equation:"Equation", solve:"Solve", formula:"Formula",
    unknown:"Unknown", substitute:"Substitute", solveEquation:"Solve for x",
    lvlDesc_a1:"Use letters to represent numbers.",
    lvlDesc_a2:"Solve simple one-step equations.",
    lvlDesc_a3:"Solve equations with multiplication and division.",
    lvlDesc_a4:"Write and solve equations from word problems.",
    lvlDesc_a5:"Use formulas to find unknown values.",
    lvlDesc_aboss:"Master all algebra skills.",
    algHint_substitute:"Replace the letter with the given number.",
    algHint_onestep:"Do the opposite operation to both sides.",
    algHint_twostep:"Undo addition/subtraction first, then multiplication/division.",
    algHint_word:"Let x be the unknown, write the equation, then solve.",
    algHint_formula:"Plug in the known values and calculate.",
    /* ---- P6: Circle ---- */
    radius:"Radius", diameter:"Diameter", pi:"π",
    circumference:"Circumference", sector:"Sector", annulus:"Annulus",
    center:"Center", findCircumference:"Find the circumference",
    findCircleArea:"Find the area of the circle",
    lvlDesc_c1:"Identify parts of a circle: center, radius, diameter.",
    lvlDesc_c2:"Understand pi and the relationship between circumference and diameter.",
    lvlDesc_c3:"Calculate the circumference of a circle.",
    lvlDesc_c4:"Calculate the area of a circle.",
    lvlDesc_c5:"Solve problems with sectors and annuli.",
    lvlDesc_cboss:"Master all circle skills.",
    circHint_parts:"Radius goes from center to edge. Diameter = 2 × radius.",
    circHint_pi:"π ≈ 3.14. Circumference = π × diameter.",
    circHint_circumference:"C = π × d = 2 × π × r.",
    circHint_area:"A = π × r². Square the radius first, then multiply by π.",
    circHint_sector:"A sector is a fraction of the circle.",
    /* ---- P6: Statistics & Probability ---- */
    mean:"Mean", median:"Median", mode:"Mode",
    probability:"Probability", data:"Data", average:"Average",
    lineGraph:"Line Graph", pieChart:"Pie Chart",
    findMean:"Find the mean", findMedian:"Find the median",
    findProbability:"Find the probability",
    lvlDesc_st1:"Calculate the mean (average) of a data set.",
    lvlDesc_st2:"Find the median and mode of a data set.",
    lvlDesc_st3:"Read and interpret line graphs.",
    lvlDesc_st4:"Read and interpret pie charts.",
    lvlDesc_st5:"Calculate basic probability.",
    lvlDesc_stboss:"Master all statistics and probability skills.",
    statsHint_mean:"Mean = sum of all values ÷ number of values.",
    statsHint_median:"Arrange in order. Median is the middle value.",
    statsHint_mode:"Mode is the value that appears most often.",
    statsHint_graph:"Read the title and labels, then find the values.",
    statsHint_prob:"Probability = favorable outcomes ÷ total outcomes.",
    /* ---- New regions ---- */
    region_fraction:"Fraction Grove", region_fraction_topic:"Fractions",
    region_fraction_desc:"Master equivalent fractions, simplifying, and operations with fractions.",
    region_percent:"Shadow Proportions", region_percent_topic:"Percentages",
    region_percent_desc:"Understand percentages, conversion, and real-life percentage problems.",
    region_ratio:"Wind Moors", region_ratio_topic:"Ratio & Proportion",
    region_ratio_desc:"Learn ratios, sharing, direct and inverse proportion.",
    region_geo2:"Shape Highlands", region_geo2_topic:"Advanced Geometry",
    region_geo2_desc:"Calculate areas of triangles, parallelograms, trapeziums and composites.",
    region_negative:"Dark Forest", region_negative_topic:"Negative Numbers",
    region_negative_desc:"Understand negative numbers, number lines, and operations.",
    region_algebra:"SkyClan Heights", region_algebra_topic:"Algebra",
    region_algebra_desc:"Use variables, solve equations, and apply formulas.",
    region_circle:"Moonstone", region_circle_topic:"Circles",
    region_circle_desc:"Explore radius, diameter, circumference and area of circles.",
    region_stats:"StarClan Sky", region_stats_topic:"Statistics & Probability",
    region_stats_desc:"Calculate mean, median, mode and basic probability.",
    /* ---- Seasons ---- */
    season1:"Season 1 · Forest Beginnings", season1_short:"P3-P4",
    season2:"Season 2 · Deep Forest", season2_short:"P5",
    season3:"Season 3 · Path to StarClan", season3_short:"P6",
    lockedSeason:"Reach the rank of Warrior (500 pts) to unlock Season 2.",
    lockedSeason3:"Reach the rank of Deputy (2000 pts) to unlock Season 3.",
    /* ---- Daily tasks & streak ---- */
    dailyTasks:"Daily Quests", streak:"Streak", day:"Day",
    taskComplete:"Complete!", dailyAllDone:"All daily quests done! Come back tomorrow.",
    task1:"Complete 1 hunt", task2:"Answer 10 questions correctly",
    task3:"Practice in any territory", dailyReward:"+30 pts bonus!",
    /* ---- Auth ---- */
    authLogin:"Log In", authRegister:"Sign Up", authLogout:"Log Out",
    authLoginTitle:"Log In", authRegisterTitle:"Create Account",
    authEmail:"Email", authPassword:"Password", authPasswordHint:"At least 6 characters",
    authLoginBtn:"Log In", authRegisterBtn:"Create Account",
    authHaveAccount:"Already have an account? Log in", authNoAccount:"No account? Sign up",
    authLoggedInAs:"Logged in as", authLoggedOut:"Not logged in",
    authCloudSync:"Progress saved to your account", authLocalOnly:"Log in to sync across devices",
    authLogoutConfirm:"Log out? Your progress stays on this device.",
    authRegisterSuccess:"Account created! Progress saved to cloud.", authLoginSuccess:"Welcome back!",
    authError:"Something went wrong. Please try again.",
    /* ---- Story chapters ---- */
    chapters:"Story Chapters", chapter:"Chapter",
    ch_locked:"Complete previous chapters to unlock this story.",
    chapter1_title:"The Kit's Awakening",
    chapter1_text:"Fireheart finds you shivering at the camp entrance. \"Young one, the forest is full of danger, but numbers are your claws. Let me teach you the four operations — they will sharpen your mind as surely as a warrior sharpens claws on the old oak.\"",
    chapter2_title:"Trial of the Stream",
    chapter2_text:"Graystripe leads you to the babbling stream. \"See those ripples? Each one precise, each one measured. Decimals are like that — every digit after the point matters. Line them up carefully, and the prey will be yours.\"",
    chapter3_title:"Ancient Wisdom",
    chapter3_text:"Sandstorm sits beside the ancient oak, her eyes half-closed. \"This camp has stood for generations. Every stone is a shape, every angle tells a story. Learn to see the geometry around you, and no problem will escape your paws.\"",
    chapter4_title:"The High View",
    chapter4_text:"Bluestar stands atop the high rocks, wind ruffling her fur. \"From here, the world has depth. Cubes and cylinders, faces and edges — train your inner eye to see in three dimensions. Only then will you be ready to lead.\""
  },
  "zh-TW": {
    appTitle:"貓武士數學森林", subtitle:"雷族 · 狩獵成長",
    storyIntro:"你是雷族的小貓。在森林四大領地中訓練，通過解題狩獵獵物，從幼崽成長為族長！",
    play:"進入森林", settings:"設定", back:"返回", home:"營地", next:"下一題",
    submit:"提交", clear:"清除", del:"⌫", hint:"提示", showSolution:"查看解析",
    retry:"再試一次", replay:"再獵一次", rank:"頭銜", points:"積分", freshkill:"獵物堆",
    yourRank:"你的頭銜", chooseLevel:"選擇狩獵", randomHunt:"隨機狩獵",
    difficulty:"難度", tier1:"基礎", tier2:"進階", tier3:"挑戰", tier4:"考核", question:"第", of:"題，共", score:"已獵獵物",
    adaptEasy:"放鬆", adaptNormal:"穩定", adaptHard:"挑戰",
    lockLevel:"完成上一關即可解鎖", lockBoss:"完成所有關卡即可解鎖考核",
    correct:"正確！", wrong:"獵物跑掉了！", correctAnswer:"正確答案",
    solution:"解析", levelComplete:"狩獵完成", rankUp:"晉升頭銜！",
    newRank:"你現在是", language:"語言", sound:"音效", on:"開", off:"關",
    en:"English", "zh-TW":"繁體中文", starsEarned:"獲得星星", pointsGained:"獲得積分", completeBonus:"完成獎勵",
    noStars:"繼續訓練，武士！",
    mistakeBook:"錯題本", reviewTitle:"錯題重温", startReview:"開始錯題重温",
    noMistakes:"沒有錯題需要重温，幹得好！", dueNow:"到期", yourAnswer:"你的答案", cardAlbum:"卡片相冊", weakPoints:"薄弱知識點", mastery:"掌握度", gradeSelect:"選擇你的年級", grade1:"P3-P4 森林初探", grade2:"P5 森林深處", grade3:"P6 星族之路", dailyCheckin:"今日打卡", dailyHuntBtn:"開始今日打卡", yourGrade:"年級", aiAnalyze:"AI 導師分析", aiAnalyzing:"分析中...", aiNotConfigured:"AI 尚未配置", aiLoginRequired:"請先登入才能使用 AI 分析。", aiLoginBtn:"登入", aiNoData:"還沒有足夠數據，先答幾道題吧！", microLesson:"微課", courseRec:"薄弱點微課推薦", courseLabel:"微課", startGuided:"開始引導練習", courseHunt:"鞏固狩獵", courseDone:"學會了！", courseHint:"先看懂步驟，再來一場狩獵徹底掌握！", cpConcrete:"具象", cpPictorial:"圖像", cpAbstract:"抽象", unlockStars:"收集 {need} 顆星解鎖（{have}/{need}）", tierLadder:"難度階梯",
    territories:"森林領地", chooseTerritory:"選擇領地",
    mentor:"導師", badges:"徽章", badgeEarned:"獲得徽章！",
    noBadges:"完成領地考核即可獲得徽章。",
    add:"加", subtract:"減", multiply:"乘", divide:"除",
    parenthesesFirst:"先算括號", then:"再算", equals:"=", first:"先", step:"步",
    "+":"加", "-":"減", "×":"乘", "÷":"除",
    acute:"銳角", rightAngle:"直角", obtuse:"鈍角",
    parallel:"平行", perpendicular:"垂直", intersecting:"相交",
    face:"面", edge:"棱", vertex:"頂點", faces:"面", edges:"棱", vertices:"頂點",
    perimeter:"周界", area:"面積", volume:"體積",
    cube:"正方體", cuboid:"長方體", cylinder:"圓柱體", cone:"圓錐體",
    sphere:"球體", prism:"三角柱體", pyramid:"四角錐體",
    triangle:"三角形", rectangle:"長方形", square:"正方形", circle:"圓形",
    pentagon:"五邊形", hexagon:"六邊形", parallelogram:"平行四邊形",
    trapezium:"梯形", rhombus:"菱形",
    tenths:"十分位", hundredths:"百分位", tenthsPlace:"十分位", hundredthsPlace:"百分位",
    whatShape:"這是什麼圖形？", whatShape3d:"這是什麼立體圖形？",
    whatAngle:"這是什麼角？", whatLines:"這是什麼線？",
    whichNet:"這個展開圖可以做成什麼立體圖形？",
    findPerimeter:"求周界", findArea:"求面積", findVolume:"求體積",
    howManyCubes:"有多少個小正方體？", howManyFaces:"它有多少個面？",
    howManyEdges:"它有多少條棱？", howManyVertices:"它有多少個頂點？",
    whichLargest:"哪個最大？", whichSmallest:"哪個最小？",
    compareFill:"比較大小：填入 > 、 < 或 =",
    whatValue:"數字", in_the_number:"在數字",
    praise1:"好身手！", praise2:"動作真快！", praise3:"像個真正的武士！",
    praise4:"太棒了！", praise5:"雷族以你為榮！",
    region_mixed:"狩獵訓練場", region_mixed_topic:"混合運算",
    region_mixed_desc:"訓練四則運算、運算順序、括號與應用題。",
    region_decimal:"溪流漁場", region_decimal_topic:"小數運算",
    region_decimal_desc:"掌握小數位值、比較大小及小數四則運算。",
    region_geometry:"古樹營地", region_geometry_topic:"平面幾何",
    region_geometry_desc:"認識圖形、角度、線，並計算周界和面積。",
    region_spatial:"高地石林", region_spatial_topic:"立體空間",
    region_spatial_desc:"認識立體圖形、展開圖，數面和棱，計算體積。",
    lvlDesc_m1:"較大數字的加減乘除。",
    lvlDesc_m2:"先乘除，後加減。",
    lvlDesc_m3:"括號裡的先算。",
    lvlDesc_m4:"一個算式兩步計算。",
    lvlDesc_m5:"解決部族狩獵的實際問題。",
    lvlDesc_m6:"用結合律、分配律巧算。",
    lvlDesc_m7:"找出錯誤、估算驗算。",
    lvlDesc_m8:"多位數運算律、應用題與思維巧算。",
    lvlDesc_mboss:"證明你已準備好成為武士。",
    lvlDesc_d1:"認識十分位和百分位。",
    lvlDesc_d2:"比較小數的大小。",
    lvlDesc_d3:"一位至兩位小數的加法。",
    lvlDesc_d4:"一位至兩位小數的減法。",
    lvlDesc_d5:"小數乘以整數。",
    lvlDesc_dboss:"綜合小數運算考核。", lvlDesc_d6:"小數應用題（含小數乘法）。", lvlDesc_gword:"運用周界與面積解決營地實際問題。", lvlDesc_sword:"體積與數正方體的應用題。",
    lvlDesc_g1:"根據特徵辨認平面圖形。",
    lvlDesc_g2:"認識銳角、直角和鈍角。",
    lvlDesc_g3:"計算長方形和正方形的周界。",
    lvlDesc_g4:"計算長方形和正方形的面積。",
    lvlDesc_g5:"辨認平行線和垂直線。",
    lvlDesc_gboss:"綜合幾何考核。",
    lvlDesc_s1:"認識正方體、圓柱體、圓錐體、球體等。",
    lvlDesc_s2:"數出立體圖形的面、棱和頂點。",
    lvlDesc_s3:"將展開圖配對立體圖形。",
    lvlDesc_s4:"計算長方體的體積。",
    lvlDesc_s5:"數出立體圖形中的小正方體數量。",
    lvlDesc_sboss:"綜合空間考核。",
    bossLabel:"考核", startHunt:"開始狩獵", bestStars:"最佳", lockedSoon:"多加訓練以成長",
    decHint_add:"對齊小數點，逐位相加。",
    decHint_sub:"對齊小數點，逐位相減。",
    decHint_mul:"先當整數乘，再數小數位。",
    decHint_place:"小數點後第一位是十分位，第二位是百分位。",
    decHint_compare:"從左到右逐位比較。",
    geoHint_shape:"數數邊數，看看角度。",
    geoHint_angle:"小於 90° 是銳角，等於 90° 是直角，大於 90° 小於 180° 是鈍角。",
    geoHint_perimeter:"周界 = 所有邊的總和。長方形：(長 + 寬) × 2。",
    geoHint_area:"長方形面積 = 長 × 寬。",
    geoHint_lines:"平行線永不相交。垂直線成直角相交。",
    spHint_shape:"看看面：平的、曲的、三角形還是正方形？",
    spHint_props:"正方體有 6 個面、12 條棱、8 個頂點。",
    spHint_net:"想像把展開圖摺成立體圖形。",
    spHint_volume:"體積 = 長 × 寬 × 高。",
    spHint_count:"一層一層數，包括看不見的。",
    /* ---- P5: 分數 ---- */
    fraction:"分數", numerator:"分子", denominator:"分母",
    equivalentFraction:"等值", simplify:"約分", expand:"擴分",
    mixedNumber:"帶分數", improperFraction:"假分數", lowestTerms:"最簡",
    findEquivalent:"找出等值分數", simplifyFraction:"約分",
    fracAdd:"分數加法", fracSub:"分數減法",
    fracMulInt:"分數乘法", fracDivInt:"分數除法",
    lvlDesc_f1:"用圖形和數字找出等值分數。",
    lvlDesc_f2:"將分數約分至最簡。",
    lvlDesc_f3:"同分母分數的加減。",
    lvlDesc_f4:"異分母分數的加減。",
    lvlDesc_f5:"分數乘以和除以整數。",
    lvlDesc_fboss:"綜合分數運算考核。",
    fracHint_equivalent:"分子和分母同時乘以或除以同一個數。",
    fracHint_simplify:"分子和分母同時除以最大公因數。",
    fracHint_add_same:"分子相加，分母不變。",
    fracHint_add_diff:"先通分（找共同分母），再相加。",
    fracHint_mul:"分子乘以整數，分母不變。",
    fracHint_div:"除以整數 = 乘以它的倒數。",
    /* ---- P5: 百分數 ---- */
    percent:"百分數", percentMeaning:"百分數表示每 100 中的份數",
    discount:"折扣", profit:"利潤", originalPrice:"原價",
    convertToPercent:"轉換為百分數", findPercent:"求百分數",
    percentIncrease:"增加的百分數", percentDecrease:"減少的百分數",
    lvlDesc_p1:"認識百分數（每 100 為單位）。",
    lvlDesc_p2:"分數、小數和百分數互化。",
    lvlDesc_p3:"求一個數是另一個數的百分之幾。",
    lvlDesc_p4:"計算百分數的增加和減少。",
    lvlDesc_p5:"解決折扣和利潤問題。",
    lvlDesc_pboss:"綜合百分數考核。",
    pctHint_meaning:"百分數即每 100。25% = 100 中的 25。",
    pctHint_convert:"小數化百分數，乘以 100。",
    pctHint_find:"部分 ÷ 總數 × 100% = 百分數。",
    pctHint_change:"差值 ÷ 原值 × 100% = 增減百分數。",
    pctHint_discount:"折扣價 = 原價 × (1 - 折扣率)。",
    /* ---- P5: 比與比例 ---- */
    ratio:"比", ratioColon:":", directProportion:"正比例",
    inverseProportion:"反比例", shareByRatio:"按比分配",
    simplifyRatio:"化簡比", divideByRatio:"按比分配",
    lvlDesc_r1:"認識比的意義（比較兩個量）。",
    lvlDesc_r2:"將比化為最簡。",
    lvlDesc_r3:"按給定的比分配一個數量。",
    lvlDesc_r4:"解決正比例問題。",
    lvlDesc_r5:"解決反比例問題。",
    lvlDesc_rboss:"綜合比與比例考核。",
    ratioHint_meaning:"比用來比較兩個量，如 3:2。",
    ratioHint_simplify:"兩邊同時除以最大公因數。",
    ratioHint_share:"先加比的各份，求一份，再乘。",
    ratioHint_direct:"一個量增大，另一個也按相同比例增大。",
    ratioHint_inverse:"一個量增大，另一個反而減小。",
    /* ---- P5: 進階幾何 ---- */
    triangleArea:"三角形面積", parallelogramArea:"平行四邊形面積",
    trapeziumArea:"梯形面積", angleSum:"內角和",
    compositeShape:"組合圖形", base:"底", height:"高",
    findTriangleArea:"求三角形面積", findParallelogramArea:"求平行四邊形面積",
    findTrapeziumArea:"求梯形面積", findMissingAngle:"求未知角",
    findCompositeArea:"求總面積",
    lvlDesc_g6:"計算三角形的面積。",
    lvlDesc_g7:"計算平行四邊形的面積。",
    lvlDesc_g8:"計算梯形的面積。",
    lvlDesc_g9:"利用三角形內角和求未知角。",
    lvlDesc_g10:"計算組合圖形的面積。",
    lvlDesc_g2boss:"綜合進階幾何考核。",
    geo2Hint_triangle:"三角形面積 = 底 × 高 ÷ 2。",
    geo2Hint_parallelogram:"平行四邊形面積 = 底 × 高。",
    geo2Hint_trapezium:"梯形面積 = (上底 + 下底) × 高 ÷ 2。",
    geo2Hint_angle:"三角形內角和 = 180°。",
    geo2Hint_composite:"把組合圖形拆成長方形和三角形。",
    /* ---- P6: 負數 ---- */
    negative:"負數", positive:"正數", numberLine:"數線",
    temperature:"溫度", aboveZero:"零上", belowZero:"零下",
    lvlDesc_n1:"認識正數和負數。",
    lvlDesc_n2:"在數線上比較和排列數字。",
    lvlDesc_n3:"正負數的加減。",
    lvlDesc_n4:"解決溫度和海拔的應用題。",
    lvlDesc_nboss:"綜合負數考核。",
    negHint_intro:"零以下的數是負數，如 -3。零以上是正數。",
    negHint_compare:"數線上右邊的數較大。-2 比 -5 大。",
    negHint_add:"加正數向右移，加負數向左移。",
    negHint_word:"找變化的方向和大小，再加或減。",
    /* ---- P6: 代數 ---- */
    variable:"變數", equation:"方程", solve:"求解", formula:"公式",
    unknown:"未知數", substitute:"代入", solveEquation:"解方程求 x",
    lvlDesc_a1:"用字母表示數。",
    lvlDesc_a2:"解簡單的一步方程。",
    lvlDesc_a3:"解含有乘除的方程。",
    lvlDesc_a4:"列方程解應用題。",
    lvlDesc_a5:"用公式求未知數。",
    lvlDesc_aboss:"綜合代數考核。",
    algHint_substitute:"把字母換成給定的數字。",
    algHint_onestep:"兩邊同時做相反的運算。",
    algHint_twostep:"先消加減，再消乘除。",
    algHint_word:"設 x 為未知數，列方程，再求解。",
    algHint_formula:"代入已知數值計算。",
    /* ---- P6: 圓 ---- */
    radius:"半徑", diameter:"直徑", pi:"π",
    circumference:"圓周", sector:"扇形", annulus:"環形",
    center:"圓心", findCircumference:"求圓周長",
    findCircleArea:"求圓面積",
    lvlDesc_c1:"認識圓的各部分：圓心、半徑、直徑。",
    lvlDesc_c2:"認識圓周率 π 和周長與直徑的關係。",
    lvlDesc_c3:"計算圓的周長。",
    lvlDesc_c4:"計算圓的面積。",
    lvlDesc_c5:"解決扇形和環形的問題。",
    lvlDesc_cboss:"綜合圓考核。",
    circHint_parts:"半徑從圓心到邊。直徑 = 2 × 半徑。",
    circHint_pi:"π ≈ 3.14。圓周 = π × 直徑。",
    circHint_circumference:"C = π × d = 2 × π × r。",
    circHint_area:"A = π × r²。先平方半徑，再乘 π。",
    circHint_sector:"扇形是圓的一部分。",
    /* ---- P6: 統計與概率 ---- */
    mean:"平均數", median:"中位數", mode:"眾數",
    probability:"概率", data:"數據", average:"平均",
    lineGraph:"折線圖", pieChart:"圓形圖",
    findMean:"求平均數", findMedian:"求中位數",
    findProbability:"求概率",
    lvlDesc_st1:"計算一組數據的平均數。",
    lvlDesc_st2:"求一組數據的中位數和眾數。",
    lvlDesc_st3:"閱讀和理解折線圖。",
    lvlDesc_st4:"閱讀和理解圓形圖。",
    lvlDesc_st5:"計算基本概率。",
    lvlDesc_stboss:"綜合統計與概率考核。",
    statsHint_mean:"平均數 = 所有數值的總和 ÷ 數據個數。",
    statsHint_median:"先排列順序，中位數就是中間的數。",
    statsHint_mode:"眾數是出現最多次的數值。",
    statsHint_graph:"先看標題和標籤，再找數值。",
    statsHint_prob:"概率 = 符合條件的結果數 ÷ 所有結果數。",
    /* ---- 新領地 ---- */
    region_fraction:"分數林地", region_fraction_topic:"分數",
    region_fraction_desc:"掌握等值分數、約分和分數運算。",
    region_percent:"影族暗影", region_percent_topic:"百分數",
    region_percent_desc:"認識百分數、互化及生活中的百分數問題。",
    region_ratio:"風族荒原", region_ratio_topic:"比與比例",
    region_ratio_desc:"學習比、按比分配、正比例和反比例。",
    region_geo2:"形狀高地", region_geo2_topic:"進階幾何",
    region_geo2_desc:"計算三角形、平行四邊形、梯形和組合圖形的面積。",
    region_negative:"暗森林", region_negative_topic:"負數",
    region_negative_desc:"認識負數、數線和正負數運算。",
    region_algebra:"天族高地", region_algebra_topic:"代數",
    region_algebra_desc:"用變數表示數、解方程和運用公式。",
    region_circle:"月亮石", region_circle_topic:"圓",
    region_circle_desc:"探索半徑、直徑、圓周和圓面積。",
    region_stats:"星族星空", region_stats_topic:"統計與概率",
    region_stats_desc:"計算平均數、中位數、眾數和基本概率。",
    /* ---- 季節 ---- */
    season1:"第一季 · 森林初探", season1_short:"P3-P4",
    season2:"第二季 · 森林深處", season2_short:"P5",
    season3:"第三季 · 星族之路", season3_short:"P6",
    lockedSeason:"達到武士頭銜（500 分）解鎖第二季。",
    lockedSeason3:"達到副族長頭銜（2000 分）解鎖第三季。",
    /* ---- 每日任務與打卡 ---- */
    dailyTasks:"每日任務", streak:"連續", day:"第",
    taskComplete:"完成！", dailyAllDone:"今日任務全部完成！明天再來吧。",
    task1:"完成 1 次狩獵", task2:"答對 10 道題",
    task3:"在任何領地練習", dailyReward:"+30 分獎勵！",
    /* ---- 登入註冊 ---- */
    authLogin:"登入", authRegister:"註冊", authLogout:"登出",
    authLoginTitle:"登入", authRegisterTitle:"建立帳號",
    authEmail:"電郵", authPassword:"密碼", authPasswordHint:"至少 6 個字符",
    authLoginBtn:"登入", authRegisterBtn:"建立帳號",
    authHaveAccount:"已有帳號？登入", authNoAccount:"沒有帳號？註冊",
    authLoggedInAs:"已登入", authLoggedOut:"未登入",
    authCloudSync:"進度已儲存至你的帳號", authLocalOnly:"登入後可在不同裝置同步進度",
    authLogoutConfirm:"確定登出？進度會保留在此裝置上。",
    authRegisterSuccess:"帳號已建立！進度已儲存至雲端。", authLoginSuccess:"歡迎回來！",
    authError:"發生錯誤，請重試。",
    /* ---- 故事章節 ---- */
    chapters:"故事章節", chapter:"第",
    ch_locked:"完成前面的章節才能解鎖此故事。",
    chapter1_title:"幼崽的覺醒",
    chapter1_text:"火心在營地入口發現了瑟瑟發抖的你。「小傢伙，森林充滿危險，但數字就是你的利爪。讓我教你四則運算——它們會像武士在老橡樹上磨爪一樣磨利你的頭腦。」",
    chapter2_title:"溪流的試煉",
    chapter2_text:"灰條帶你來到潺潺的溪流邊。「看那些漣漪？每一圈都精確、每一圈都有量度。小數就像這樣——小數點後的每一位都重要。對齊它們，獵物就是你的了。」",
    chapter3_title:"古老的智慧",
    chapter3_text:"砂風坐在古橡樹旁，半閉著眼。「這個營地傳了好多代。每塊石頭都是圖形，每個角度都有故事。學會看到身邊的幾何，就沒有問題能逃過你的爪子。」",
    chapter4_title:"高處的視野",
    chapter4_text:"藍星站在高岩上，風吹動她的毛。「從這裡看，世界有深度。正方體和圓柱體、面和棱——訓練你的心眼去看立體。只有這樣，你才準備好帶領部族。」"
  }
};

WCM.t = function(key){
  var d = WCM.I18N[WCM.lang] || WCM.I18N.en;
  return d[key] !== undefined ? d[key] : (WCM.I18N.en[key] !== undefined ? WCM.I18N.en[key] : key);
};

/* ---------- Ranks ---------- */
WCM.RANKS = [
  { min:0,    en:"Kit",            zh:"幼崽",     emoji:"🐱" },
  { min:200,  en:"Apprentice",     zh:"學徒",     emoji:"🐾" },
  { min:500,  en:"Warrior",        zh:"武士",     emoji:"⚔️" },
  { min:1000, en:"Senior Warrior", zh:"資深武士", emoji:"🌟" },
  { min:2000, en:"Deputy",         zh:"副族長",   emoji:"🛡️" },
  { min:4000, en:"Clan Leader",    zh:"族長",     emoji:"👑" }
];
WCM.rankName = function(r){ return WCM.lang==='zh-TW' ? r.zh : r.en; };
WCM.rankAt = function(pts){ var r=WCM.RANKS[0]; for(var i=0;i<WCM.RANKS.length;i++) if(pts>=WCM.RANKS[i].min) r=WCM.RANKS[i]; return r; };
WCM.rankIndexAt = function(pts){ var idx=0; for(var i=0;i<WCM.RANKS.length;i++) if(pts>=WCM.RANKS[i].min) idx=i; return idx; };

/* ---------- Prey ---------- */
WCM.PREY = [
  { key:"mouse",    en:"Mouse",    zh:"老鼠", emoji:"🐭", pts:10 },
  { key:"vole",     en:"Vole",     zh:"田鼠", emoji:"🐀", pts:15 },
  { key:"squirrel", en:"Squirrel", zh:"松鼠", emoji:"🐿️", pts:20 },
  { key:"thrush",   en:"Thrush",   zh:"畫眉", emoji:"🐦", pts:20 },
  { key:"fish",     en:"Fish",     zh:"魚",   emoji:"🐟", pts:25 },
  { key:"rabbit",   en:"Rabbit",   zh:"兔子", emoji:"🐰", pts:30 }
];
WCM.preyBy = function(k){ for(var i=0;i<WCM.PREY.length;i++) if(WCM.PREY[i].key===k) return WCM.PREY[i]; return WCM.PREY[0]; };
WCM.preyName = function(p){ return WCM.lang==='zh-TW' ? p.zh : p.en; };
WCM.preyForDiff = function(d){
  if(d<=1) return "mouse";
  if(d===2) return ["vole","squirrel","thrush"][Math.floor(Math.random()*3)];
  if(d===3) return ["rabbit","fish"][Math.floor(Math.random()*2)];
  return "rabbit";
};

/* ---------- Regions ---------- */
WCM.REGIONS = [
  { id:"mixed",    icon:"🐾", en:"Hunting Grounds",    zh:"狩獵訓練場", mentor:"fireheart",  season:1, levels:["m1","m2","m3","m4","m5","m6","m7","m8","mboss"] },
  { id:"decimal",  icon:"🐟", en:"Stream Fishery",     zh:"溪流漁場",   mentor:"graystripe", season:1, levels:["d1","d2","d3","d4","d5","d6","dboss"] },
  { id:"geometry", icon:"🏰", en:"Ancient Tree Camp",  zh:"古樹營地",   mentor:"sandstorm",  season:1, levels:["g1","g2","g3","g4","g5","gword","gboss"] },
  { id:"spatial",  icon:"🌲", en:"Highland Rocks",     zh:"高地石林",   mentor:"bluestar",   season:1, levels:["s1","s2","s3","s4","s5","sword","sboss"] },
  /* Season 2 - P5 */
  { id:"fraction", icon:"🍃", en:"Fraction Grove",      zh:"分數林地",   mentor:"leafpool",       season:2, levels:["f1","f2","f3","f4","f5","fboss"] },
  { id:"percent",  icon:"🌑", en:"Shadow Proportions",  zh:"影族暗影",   mentor:"brambleclaw",    season:2, levels:["p1","p2","p3","p4","p5","pboss"] },
  { id:"ratio",    icon:"💨", en:"Wind Moors",          zh:"風族荒原",   mentor:"lionblaze",      season:2, levels:["r1","r2","r3","r4","r5","rboss"] },
  { id:"geo2",     icon:"📐", en:"Shape Highlands",     zh:"形狀高地",   mentor:"squirrelflight", season:2, levels:["g6","g7","g8","g9","g10","g2boss"] },
  /* Season 3 - P6 */
  { id:"negative", icon:"🐯", en:"Dark Forest",         zh:"暗森林",     mentor:"tigerstar",      season:3, levels:["n1","n2","n3","n4","nboss"] },
  { id:"algebra",  icon:"🦅", en:"SkyClan Heights",     zh:"天族高地",   mentor:"crowfeather",    season:3, levels:["a1","a2","a3","a4","a5","aboss"] },
  { id:"circle",   icon:"🌙", en:"Moonstone",           zh:"月亮石",     mentor:"halfmoon",       season:3, levels:["c1","c2","c3","c4","c5","cboss"] },
  { id:"stats",    icon:"⭐", en:"StarClan Sky",        zh:"星族星空",   mentor:"yellowfang",     season:3, levels:["st1","st2","st3","st4","st5","stboss"] }
];
WCM.regionName = function(r){ return WCM.lang==='zh-TW' ? r.zh : r.en; };
WCM.regionTopic = function(r){ return WCM.t('region_'+r.id+'_topic'); };
WCM.regionDesc = function(r){ return WCM.t('region_'+r.id+'_desc'); };
WCM.regionById = function(id){ for(var i=0;i<WCM.REGIONS.length;i++) if(WCM.REGIONS[i].id===id) return WCM.REGIONS[i]; return WCM.REGIONS[0]; };
WCM.regionOfLevel = function(lvId){
  for(var i=0;i<WCM.REGIONS.length;i++){
    var ls=WCM.REGIONS[i].levels;
    for(var j=0;j<ls.length;j++) if(ls[j]===lvId) return WCM.REGIONS[i];
  }
  return WCM.REGIONS[0];
};

/* ---------- Level Unlock (progressive learning path) ---------- */
/* Parallel-by-difficulty unlock: basic (diff 1) levels are always open so
   several knowledge points can be practised at once; intermediate (diff 2)
   and advanced (diff 3) open as the warrior earns stars in the region; the
   boss assessment opens once every non-boss level has been cleared. */
WCM.levelUnlockStars = function(level){
  var d = level.diff||1;
  if(d<=1) return 0;
  if(d===2) return 2;
  return 4;
};
WCM.isLevelUnlocked = function(level){
  var region = WCM.regionOfLevel(level.id);
  var season = region.season||1;
  if(!WCM.isSeasonUnlocked(season)) return false;
  var levels = WCM.levelsInRegion(region.id);
  if(level.boss){
    for(var j=0;j<levels.length;j++){ if(!levels[j].boss && WCM.getProgress(levels[j].id).stars<1) return false; }
    return true;
  }
  return WCM.regionStars(region.id) >= WCM.levelUnlockStars(level);
};
WCM.levelUnlockHint = function(level){
  if(level.boss) return WCM.t('lockBoss');
  var need = WCM.levelUnlockStars(level);
  if(need<=0) return WCM.t('lockLevel');
  var have = WCM.regionStars(WCM.regionOfLevel(level.id).id);
  return WCM.t('unlockStars').replace(/\{need\}/g, need).replace(/\{have\}/g, have);
};

/* ---------- Seasons ---------- */
WCM.regionsInSeason = function(season){
  return WCM.REGIONS.filter(function(r){ return (r.season||1)===season; });
};
WCM.isSeasonUnlocked = function(season){
  if(season<=1) return true;
  if(season===2) return WCM.state.points >= 500;
  if(season===3) return WCM.state.points >= 2000;
  return false;
};
WCM.seasonName = function(season){
  return WCM.t('season'+season);
};
WCM.seasonShort = function(season){
  return WCM.t('season'+season+'_short');
};

/* ---------- Mentors ---------- */
WCM.MENTORS = {
  fireheart:  { en:"Fireheart",  zh:"火星",   emoji:"🔥",
    intro_en:"Welcome to the training hollow, young apprentice! Let us sharpen your claws with the four operations.",
    intro_zh:"歡迎來到訓練沙坑，小學徒！讓我們用四則運算磨利你的爪子。" },
  graystripe: { en:"Graystripe", zh:"灰條",   emoji:"🐈",
    intro_en:"The stream teaches patience. Decimals are like ripples — precise and careful. Let us fish!",
    intro_zh:"溪流教人耐心。小數就像漣漪——精確而細心。一起來捕魚吧！" },
  sandstorm:  { en:"Sandstorm",  zh:"砂風",   emoji:"🏜️",
    intro_en:"The old camp holds ancient wisdom. Shapes and angles surround us everywhere. Open your eyes!",
    intro_zh:"古營地藏著古老的智慧。圖形和角度無處不在。睜大你的眼睛！" },
  bluestar:   { en:"Bluestar",   zh:"藍星",   emoji:"⭐",
    intro_en:"From the high rocks, see the world in three dimensions. Train your inner eye, young one.",
    intro_zh:"站在高石上，用立體的眼光看世界。鍛鍊你的心眼，小傢伙。" },
  leafpool:     { en:"Leafpool",      zh:"葉池",   emoji:"🍃",
    intro_en:"The grove hums with life. Fractions are about sharing fairly - every cat gets their portion. Let us learn together!",
    intro_zh:"林地充滿生機。分數就是公平分配--每隻貓都有自己的一份。一起來學吧！" },
  brambleclaw:  { en:"Brambleclaw",   zh:"黑莓掌", emoji:"🌑",
    intro_en:"Shadows hide proportions. Percentages reveal what shadows conceal. Face your fears, apprentice!",
    intro_zh:"暗影中藏著比例。百分數能揭示暗影隱藏的真相。面對你的恐懼，學徒！" },
  lionblaze:    { en:"Lionblaze",     zh:"獅焰",   emoji:"💫",
    intro_en:"The open moors teach ratio and proportion. Run swift, think swift! Speed and fairness go paw in paw.",
    intro_zh:"開闊的荒原教你比與比例。跑得快，想得也快！速度和公平並行。" },
  squirrelflight:{ en:"Squirrelflight",zh:"松鼠飛", emoji:"🐿️",
    intro_en:"Highland shapes test your skills. Triangles, trapeziums - each has its own secret. Climb higher!",
    intro_zh:"高地的圖形考驗你的本領。三角形、梯形--各有各的秘密。向上攀登！" },
  tigerstar:    { en:"Tigerstar",     zh:"虎星",   emoji:"🐯",
    intro_en:"The Dark Forest holds negative numbers - the cold below zero. Not all numbers are warm. Master the cold!",
    intro_zh:"暗森林藏著負數--零以下的寒冷。不是所有數字都是溫暖的。征服寒冷吧！" },
  crowfeather:  { en:"Crowfeather",   zh:"鴉羽",   emoji:"🦅",
    intro_en:"SkyClan heights reach toward algebra. Let x be the unknown prey. Equations are the path to the sky!",
    intro_zh:"天族高地通向代數。設 x 為未知的獵物。方程是通往天空的路！" },
  halfmoon:     { en:"Half Moon",     zh:"半月",   emoji:"🌙",
    intro_en:"The Moonstone glows with circles. Pi connects all circles. Touch the stone and see the endless curve!",
    intro_zh:"月亮石閃耀著圓的光輝。圓周率連接所有圓。觸摸石頭，看見無盡的曲線！" },
  yellowfang:   { en:"Yellowfang",    zh:"黃牙",   emoji:"⭐",
    intro_en:"StarClan reads the patterns of data. Mean, median, probability - the stars whisper truths. Listen well!",
    intro_zh:"星族解讀數據的規律。平均數、中位數、概率--群星低語著真相。仔細聆聽！" }
};
WCM.mentorName = function(m){ return WCM.lang==='zh-TW' ? m.zh : m.en; };
WCM.mentorIntro = function(m){ return WCM.lang==='zh-TW' ? m.intro_zh : m.intro_en; };

/* ---------- Badges ---------- */
WCM.BADGES = {
  mixed:    { en:"Hunter's Strike",  zh:"狩獵之擊", emoji:"⚔️" },
  decimal:  { en:"Stream Swimmer",   zh:"溪流之泳", emoji:"🐟" },
  geometry: { en:"Camp Builder",     zh:"營地建造", emoji:"🏰" },
  spatial:  { en:"Sky Watcher",      zh:"天空守望", emoji:"🌲" },
  fraction: { en:"Grove Guardian",   zh:"林地守護", emoji:"🍃" },
  percent:  { en:"Shadow Seer",      zh:"暗影洞察", emoji:"🌑" },
  ratio:    { en:"Moor Runner",      zh:"荒原疾跑", emoji:"💨" },
  geo2:     { en:"Highland Climber", zh:"高地攀登", emoji:"📐" },
  negative: { en:"Dark Forest Prowler", zh:"暗林潛行", emoji:"🐯" },
  algebra:  { en:"Sky Seeker",       zh:"追尋天空", emoji:"🦅" },
  circle:   { en:"Moon Touched",     zh:"觸月之貓", emoji:"🌙" },
  stats:    { en:"Star Reader",      zh:"讀星者",   emoji:"⭐" }
};
WCM.badgeName = function(b){ return WCM.lang==='zh-TW' ? b.zh : b.en; };

/* ---------- All Levels ---------- */
WCM.LEVELS = [
  /* Region 1: Mixed Operations */
  { id:"m1",    region:"mixed",    diff:1, gen:"review",  icon:"🐾", en:"Four Operations Review", zh:"四則運算複習" },
  { id:"m2",    region:"mixed",    diff:2, gen:"order",   icon:"🌿", en:"Order of Operations",    zh:"運算順序" },
  { id:"m3",    region:"mixed",    diff:2, gen:"parens",  icon:"🍃", en:"Parentheses",            zh:"括號" },
  { id:"m4",    region:"mixed",    diff:3, gen:"twostep", icon:"🦊", en:"Two-Step Mixed",         zh:"兩步混合" },
  { id:"m5",    region:"mixed",    diff:3, gen:"word",    icon:"🦉", en:"Word Problems",          zh:"應用題" },
  { id:"m6",    region:"mixed",    diff:2, gen:"laws",      icon:"⚖️", en:"Operation Laws",      zh:"運算律" },
  { id:"m7",    region:"mixed",    diff:3, gen:"checkwork", icon:"🔍", en:"Spot the Mistake",    zh:"找錯驗算" },
  { id:"m8",    region:"mixed",    diff:3, gen:"laws_adv",  icon:"🧠", en:"Advanced Laws",       zh:"運算律進階" },
  { id:"mboss", region:"mixed",    diff:4, gen:"mixed",   icon:"⚔️", en:"Warrior Assessment",     zh:"武士考核", boss:true },
  /* Region 2: Decimals */
  { id:"d1",    region:"decimal",  diff:1, gen:"dec_place",   icon:"💧", en:"Decimal Place Value",  zh:"小數位值" },
  { id:"d2",    region:"decimal",  diff:1, gen:"dec_compare",  icon:"🎣", en:"Comparing Decimals",   zh:"小數比較" },
  { id:"d3",    region:"decimal",  diff:2, gen:"dec_add",      icon:"🐟", en:"Decimal Addition",     zh:"小數加法" },
  { id:"d4",    region:"decimal",  diff:2, gen:"dec_sub",      icon:"🐠", en:"Decimal Subtraction",  zh:"小數減法" },
  { id:"d5",    region:"decimal",  diff:3, gen:"dec_mul",      icon:"🦈", en:"Decimal Multiplication", zh:"小數乘法" },
  { id:"d6",    region:"decimal",  diff:3, gen:"dec_word", icon:"🪙", en:"Decimal Word Problems",  zh:"小數應用題" },
  { id:"dboss", region:"decimal",  diff:4, gen:"dec_mixed",    icon:"🌊", en:"Stream Assessment",    zh:"溪流考核", boss:true },
  /* Region 3: Geometry */
  { id:"g1",    region:"geometry", diff:1, gen:"geo_shape",    icon:"🔺", en:"Shape Identification", zh:"認識圖形" },
  { id:"g2",    region:"geometry", diff:1, gen:"geo_angle",    icon:"📐", en:"Angles",               zh:"認識角度" },
  { id:"g3",    region:"geometry", diff:2, gen:"geo_perimeter",icon:"📏", en:"Perimeter",            zh:"周界" },
  { id:"g4",    region:"geometry", diff:2, gen:"geo_area",     icon:"🔲", en:"Area",                 zh:"面積" },
  { id:"g5",    region:"geometry", diff:2, gen:"geo_lines",    icon:"✏️", en:"Lines",                zh:"線" },
  { id:"gword", region:"geometry", diff:3, gen:"geo_word", icon:"📐", en:"Geometry Word Problems", zh:"幾何應用題" },
  { id:"gboss", region:"geometry", diff:4, gen:"geo_mixed",    icon:"🏗️", en:"Camp Assessment",      zh:"營地考核", boss:true },
  /* Region 4: 3D Spatial */
  { id:"s1",    region:"spatial",  diff:1, gen:"sp_shape",     icon:"📦", en:"3D Shapes",            zh:"立體圖形" },
  { id:"s2",    region:"spatial",  diff:2, gen:"sp_props",     icon:"🎲", en:"Faces & Edges",        zh:"面棱頂點" },
  { id:"s3",    region:"spatial",  diff:2, gen:"sp_net",       icon:"📄", en:"Nets",                 zh:"展開圖" },
  { id:"s4",    region:"spatial",  diff:2, gen:"sp_volume",    icon:"🧊", en:"Volume",               zh:"體積" },
  { id:"s5",    region:"spatial",  diff:3, gen:"sp_count",     icon:"🧱", en:"Cube Counting",        zh:"數正方體" },
  { id:"sword", region:"spatial",  diff:3, gen:"sp_word",  icon:"📦", en:"Spatial Word Problems",  zh:"立體應用題" },
  { id:"sboss", region:"spatial",  diff:4, gen:"sp_mixed",     icon:"🏔️", en:"Summit Assessment",    zh:"石林考核", boss:true },
  /* ===== Season 2: P5 ===== */
  /* Fraction */
  { id:"f1",    region:"fraction", diff:1, gen:"frac_equiv",    icon:"🍃", en:"Equivalent Fractions",  zh:"等值分數" },
  { id:"f2",    region:"fraction", diff:2, gen:"frac_simplify", icon:"🍂", en:"Simplifying",            zh:"約分" },
  { id:"f3",    region:"fraction", diff:2, gen:"frac_add_same", icon:"🌰", en:"Same Denominator",       zh:"同分母加減" },
  { id:"f4",    region:"fraction", diff:3, gen:"frac_add_diff", icon:"🦝", en:"Different Denominators", zh:"異分母加減" },
  { id:"f5",    region:"fraction", diff:3, gen:"frac_mul_div",  icon:"🦡", en:"Multiply & Divide",      zh:"分數乘除" },
  { id:"fboss", region:"fraction", diff:4, gen:"frac_mixed",    icon:"🌳", en:"Grove Assessment",       zh:"林地考核", boss:true },
  /* Percent */
  { id:"p1",    region:"percent",  diff:1, gen:"pct_meaning",   icon:"🌑", en:"Percent Meaning",        zh:"百分數意義" },
  { id:"p2",    region:"percent",  diff:2, gen:"pct_convert",   icon:"🌗", en:"Converting",             zh:"互化" },
  { id:"p3",    region:"percent",  diff:2, gen:"pct_find",      icon:"🌒", en:"Finding Percent",        zh:"求百分數" },
  { id:"p4",    region:"percent",  diff:3, gen:"pct_change",    icon:"🌘", en:"Increase & Decrease",    zh:"增減問題" },
  { id:"p5",    region:"percent",  diff:3, gen:"pct_discount",  icon:"🦝", en:"Discount & Profit",      zh:"折扣利潤" },
  { id:"pboss", region:"percent",  diff:4, gen:"pct_mixed",     icon:"🐺", en:"Shadow Assessment",      zh:"暗影考核", boss:true },
  /* Ratio */
  { id:"r1",    region:"ratio",    diff:1, gen:"ratio_meaning", icon:"💨", en:"Ratio Meaning",          zh:"比的意義" },
  { id:"r2",    region:"ratio",    diff:2, gen:"ratio_simplify",icon:"🌬️", en:"Simplifying Ratio",      zh:"化簡比" },
  { id:"r3",    region:"ratio",    diff:2, gen:"ratio_share",   icon:"🐎", en:"Sharing by Ratio",       zh:"按比分配" },
  { id:"r4",    region:"ratio",    diff:3, gen:"ratio_direct",  icon:"🏃", en:"Direct Proportion",      zh:"正比例" },
  { id:"r5",    region:"ratio",    diff:3, gen:"ratio_inverse", icon:"🔄", en:"Inverse Proportion",     zh:"反比例" },
  { id:"rboss", region:"ratio",    diff:4, gen:"ratio_mixed",   icon:"🐉", en:"Moor Assessment",        zh:"荒原考核", boss:true },
  /* Advanced Geometry */
  { id:"g6",    region:"geo2",     diff:2, gen:"geo2_triangle", icon:"📐", en:"Triangle Area",          zh:"三角形面積" },
  { id:"g7",    region:"geo2",     diff:2, gen:"geo2_parallelogram", icon:"📏", en:"Parallelogram Area", zh:"平行四邊形面積" },
  { id:"g8",    region:"geo2",     diff:3, gen:"geo2_trapezium",icon:"🔺", en:"Trapezium Area",         zh:"梯形面積" },
  { id:"g9",    region:"geo2",     diff:2, gen:"geo2_angle",    icon:"📐", en:"Angle Sum",              zh:"三角形內角和" },
  { id:"g10",   region:"geo2",     diff:3, gen:"geo2_composite",icon:"🏗️", en:"Composite Shapes",       zh:"組合圖形" },
  { id:"g2boss",region:"geo2",     diff:4, gen:"geo2_mixed",    icon:"⛰️", en:"Highland Assessment",    zh:"高地考核", boss:true },
  /* ===== Season 3: P6 ===== */
  /* Negative Numbers */
  { id:"n1",    region:"negative", diff:1, gen:"neg_intro",     icon:"🌡️", en:"Positive & Negative",    zh:"正負數" },
  { id:"n2",    region:"negative", diff:2, gen:"neg_compare",   icon:"📍", en:"Number Line",            zh:"數線比較" },
  { id:"n3",    region:"negative", diff:2, gen:"neg_addsub",    icon:"➕", en:"Add & Subtract",         zh:"正負數加減" },
  { id:"n4",    region:"negative", diff:3, gen:"neg_word",      icon:"🏔️", en:"Word Problems",          zh:"應用題" },
  { id:"nboss", region:"negative", diff:4, gen:"neg_mixed",     icon:"🐯", en:"Dark Forest Assessment", zh:"暗森林考核", boss:true },
  /* Algebra */
  { id:"a1",    region:"algebra",  diff:1, gen:"alg_substitute",icon:"🔤", en:"Variables",             zh:"用字母表示數" },
  { id:"a2",    region:"algebra",  diff:2, gen:"alg_onestep",   icon:"⚖️", en:"One-Step Equations",    zh:"一步方程" },
  { id:"a3",    region:"algebra",  diff:2, gen:"alg_twostep",   icon:"🔧", en:"Two-Step Equations",    zh:"兩步方程" },
  { id:"a4",    region:"algebra",  diff:3, gen:"alg_word",      icon:"📝", en:"Word to Equation",      zh:"列方程解題" },
  { id:"a5",    region:"algebra",  diff:3, gen:"alg_formula",   icon:"📐", en:"Formulas",              zh:"公式運用" },
  { id:"aboss", region:"algebra",  diff:4, gen:"alg_mixed",     icon:"🦅", en:"Sky Assessment",        zh:"天族考核", boss:true },
  /* Circle */
  { id:"c1",    region:"circle",   diff:1, gen:"circ_parts",    icon:"⭕", en:"Parts of a Circle",     zh:"圓的認識" },
  { id:"c2",    region:"circle",   diff:2, gen:"circ_pi",       icon:"π", en:"Pi & Diameter",         zh:"圓周率" },
  { id:"c3",    region:"circle",   diff:2, gen:"circ_circum",   icon:"🔄", en:"Circumference",         zh:"圓周長" },
  { id:"c4",    region:"circle",   diff:3, gen:"circ_area",     icon:"🔵", en:"Circle Area",           zh:"圓面積" },
  { id:"c5",    region:"circle",   diff:3, gen:"circ_sector",   icon:"🌙", en:"Sectors & Annuli",      zh:"扇形與環形" },
  { id:"cboss", region:"circle",   diff:4, gen:"circ_mixed",    icon:"🌝", en:"Moonstone Assessment",  zh:"月亮石考核", boss:true },
  /* Statistics & Probability */
  { id:"st1",   region:"stats",    diff:2, gen:"stats_mean",    icon:"📊", en:"Mean",                  zh:"平均數" },
  { id:"st2",   region:"stats",    diff:2, gen:"stats_median",  icon:"📈", en:"Median & Mode",         zh:"中位數與眾數" },
  { id:"st3",   region:"stats",    diff:2, gen:"stats_linegraph",icon:"📉", en:"Line Graphs",          zh:"折線圖" },
  { id:"st4",   region:"stats",    diff:3, gen:"stats_piechart",icon:"🥧", en:"Pie Charts",            zh:"圓形圖" },
  { id:"st5",   region:"stats",    diff:3, gen:"stats_prob",    icon:"🎲", en:"Probability",           zh:"概率" },
  { id:"stboss",region:"stats",    diff:4, gen:"stats_mixed",   icon:"✦", en:"StarClan Assessment",   zh:"星族考核", boss:true }
];
WCM.levelName = function(lv){ return WCM.lang==='zh-TW' ? lv.zh : lv.en; };
WCM.levelById = function(id){ for(var i=0;i<WCM.LEVELS.length;i++) if(WCM.LEVELS[i].id===id) return WCM.LEVELS[i]; return null; };
WCM.levelsInRegion = function(regionId){
  return WCM.LEVELS.filter(function(lv){ return lv.region===regionId; });
};

WCM.QCOUNT = { normal:6, boss:8 };

/* ---------- Story Chapters ---------- */
WCM.CHAPTERS = {
  mixed:    { num:1, titleKey:"chapter1_title", textKey:"chapter1_text" },
  decimal:  { num:2, titleKey:"chapter2_title", textKey:"chapter2_text" },
  geometry: { num:3, titleKey:"chapter3_title", textKey:"chapter3_text" },
  spatial:  { num:4, titleKey:"chapter4_title", textKey:"chapter4_text" }
};
WCM.chapterForRegion = function(regionId){ return WCM.CHAPTERS[regionId]||null; };

/* ============ CHARACTER CARDS ============ */
WCM.CARDS = [
  { id:"ravenpaw", en:"Ravenpaw", zh:"烏爪", clan:"ThunderClan", role:{en:"Apprentice",zh:"學徒"}, rarity:2, coat:"#33312f", eye:"#5aa84a", mark:"tuxedo", earn:"r1", blurb:{en:"A shy apprentice who witnessed Tigerstar's treachery.",zh:"膽小的學徒，目睹了虎星的陰謀。"} },
  { id:"fireheart", en:"Fireheart", zh:"火心", clan:"ThunderClan", role:{en:"Warrior",zh:"武士"}, rarity:5, coat:"#e0654a", eye:"#5aa84a", mark:"solid", earn:"r2", blurb:{en:"The bright ginger kittypet who rose to become ThunderClan's greatest leader.",zh:"亮橘色的寵物貓，成為雷族最偉大的族長。"} },
  { id:"whitestorm", en:"Whitestorm", zh:"白風", clan:"ThunderClan", role:{en:"Senior Warrior",zh:"資深武士"}, rarity:4, coat:"#efe9da", eye:"#4a8fc7", mark:"solid", earn:"r3", blurb:{en:"A wise white senior warrior, mentor to many.",zh:"睿智的白色資深武士，許多貓的導師。"} },
  { id:"brambleclaw", en:"Brambleclaw", zh:"棘爪", clan:"ThunderClan", role:{en:"Deputy",zh:"副族長"}, rarity:4, coat:"#6b4a2a", eye:"#d4881a", mark:"tabby", earn:"r4", blurb:{en:"Dark brown tabby who became ThunderClan's loyal deputy.",zh:"深棕虎斑貓，成為雷族忠誠的副族長。"} },
  { id:"bluestar", en:"Bluestar", zh:"藍星", clan:"ThunderClan", role:{en:"Clan Leader",zh:"族長"}, rarity:5, coat:"#7d96a8", eye:"#4a8fc7", mark:"solid", earn:"r5", blurb:{en:"The legendary blue-gray leader who guided ThunderClan through dark times.",zh:"傳奇的藍灰色族長，帶領雷族度過黑暗時期。"} },
  { id:"graystripe", en:"Graystripe", zh:"灰條", clan:"ThunderClan", role:{en:"Warrior",zh:"武士"}, rarity:3, coat:"#9a9a9a", eye:"#d4a233", mark:"solid", earn:"pool", blurb:{en:"Fireheart's loyal gray-furred best friend.",zh:"灰毛的火心摯友，忠誠可靠。"} },
  { id:"sandstorm", en:"Sandstorm", zh:"砂風", clan:"ThunderClan", role:{en:"Warrior",zh:"武士"}, rarity:3, coat:"#ec9a6a", eye:"#5aa84a", mark:"solid", earn:"pool", blurb:{en:"A fierce pale-ginger warrior and Fireheart's mate.",zh:"淺薑色的勇猛武士，火心的伴侶。"} },
  { id:"leafpool", en:"Leafpool", zh:"葉池", clan:"ThunderClan", role:{en:"Medicine Cat",zh:"巫醫"}, rarity:4, coat:"#8a6240", eye:"#d4881a", mark:"tabby", earn:"pool", blurb:{en:"Gentle brown tabby medicine cat of ThunderClan.",zh:"溫柔的棕色虎斑巫醫。"} },
  { id:"squirrelflight", en:"Squirrelflight", zh:"松鼠飛", clan:"ThunderClan", role:{en:"Warrior",zh:"武士"}, rarity:4, coat:"#c84a30", eye:"#5aa84a", mark:"solid", earn:"pool", blurb:{en:"A fiery dark-ginger she-cat, brave and stubborn.",zh:"火辣的深薑色母貓，勇敢又倔強。"} },
  { id:"lionblaze", en:"Lionblaze", zh:"獅焰", clan:"ThunderClan", role:{en:"Warrior",zh:"武士"}, rarity:5, coat:"#d4a233", eye:"#d4881a", mark:"tabby", earn:"pool", blurb:{en:"Golden tabby warrior with the power of the Three.",zh:"金色虎斑武士，三力量之一。"} },
  { id:"cinderpelt", en:"Cinderpelt", zh:"炭毛", clan:"ThunderClan", role:{en:"Medicine Cat",zh:"巫醫"}, rarity:3, coat:"#5a5a5a", eye:"#4a8fc7", mark:"solid", earn:"pool", blurb:{en:"Dark gray medicine cat who never gave up hope.",zh:"深灰色巫醫，從不放棄希望。"} },
  { id:"jayfeather", en:"Jayfeather", zh:"松鴉羽", clan:"ThunderClan", role:{en:"Medicine Cat",zh:"巫醫"}, rarity:4, coat:"#8a8a8a", eye:"#bcd0e8", mark:"tabby", earn:"pool", blurb:{en:"A blind gray tabby medicine cat with sharp senses.",zh:"失明的灰色虎斑巫醫，感官敏銳。"} },
  { id:"hollyleaf", en:"Hollyleaf", zh:"冬青葉", clan:"ThunderClan", role:{en:"Warrior",zh:"武士"}, rarity:4, coat:"#2a2a2a", eye:"#5aa84a", mark:"solid", earn:"pool", blurb:{en:"A black she-cat devoted to the warrior code.",zh:"黑色的母貓，堅守武士守則。"} },
  { id:"spottedleaf", en:"Spottedleaf", zh:"斑葉", clan:"ThunderClan", role:{en:"Medicine Cat",zh:"巫醫"}, rarity:5, coat:"#8a5a2a", coat2:"#1c1410", eye:"#d4881a", mark:"tortie", earn:"pool", blurb:{en:"A beautiful tortoiseshell medicine cat of ThunderClan.",zh:"美麗的龜殼花巫醫。"} },
  { id:"yellowfang", en:"Yellowfang", zh:"黃牙", clan:"ThunderClan", role:{en:"Medicine Cat",zh:"巫醫"}, rarity:4, coat:"#4a4a48", eye:"#d4a233", mark:"solid", earn:"pool", blurb:{en:"A grumpy dark gray medicine cat with a golden heart.",zh:"脾氣暴躁的深灰色巫醫，心地善良。"} },
  { id:"longtail", en:"Longtail", zh:"長尾", clan:"ThunderClan", role:{en:"Warrior",zh:"武士"}, rarity:2, coat:"#cdbf9a", eye:"#cdbf9a", mark:"tabby", earn:"pool", blurb:{en:"A pale tabby warrior who lost his sight but kept his pride.",zh:"淺色虎斑武士，失明後仍保有尊嚴。"} },
  { id:"silverstream", en:"Silverstream", zh:"銀溪", clan:"RiverClan", role:{en:"Warrior",zh:"武士"}, rarity:3, coat:"#c0ccd6", eye:"#4a8fc7", mark:"tabby", earn:"pool", blurb:{en:"A silver tabby RiverClan she-cat, Graystripe's love.",zh:"銀色虎斑的河族母貓，灰條的摯愛。"} },
  { id:"mistystar", en:"Mistystar", zh:"霧星", clan:"RiverClan", role:{en:"Clan Leader",zh:"族長"}, rarity:4, coat:"#8a9aa8", eye:"#4a8fc7", mark:"solid", earn:"pool", blurb:{en:"A wise gray RiverClan leader.",zh:"睿智的灰色河族族長。"} },
  { id:"leopardstar", en:"Leopardstar", zh:"豹星", clan:"RiverClan", role:{en:"Clan Leader",zh:"族長"}, rarity:4, coat:"#c79a3a", eye:"#d4881a", mark:"tabby", earn:"pool", blurb:{en:"A dappled golden RiverClan leader.",zh:"斑點金色的河族族長。"} },
  { id:"tallstar", en:"Tallstar", zh:"高星", clan:"WindClan", role:{en:"Clan Leader",zh:"族長"}, rarity:4, coat:"#2a2a2a", eye:"#d4881a", mark:"tuxedo", earn:"pool", blurb:{en:"A noble black-and-white WindClan leader.",zh:"高尚的黑白風族族長。"} },
  { id:"crowfeather", en:"Crowfeather", zh:"鴉羽", clan:"WindClan", role:{en:"Warrior",zh:"武士"}, rarity:3, coat:"#3a3a3a", eye:"#4a8fc7", mark:"solid", earn:"pool", blurb:{en:"A dark gray WindClan warrior, swift and brooding.",zh:"深灰色的風族武士，敏捷而憂鬱。"} },
  { id:"blackstar", en:"Blackstar", zh:"黑星", clan:"ShadowClan", role:{en:"Clan Leader",zh:"族長"}, rarity:4, coat:"#efe9da", eye:"#d4881a", mark:"tuxedo", earn:"pool", blurb:{en:"A large white ShadowClan leader with black paws.",zh:"白色大型的影族族長，黑爪。"} },
  { id:"tigerstar", en:"Tigerstar", zh:"虎星", clan:"ShadowClan", role:{en:"Clan Leader",zh:"族長"}, rarity:5, coat:"#5a3d22", eye:"#d4881a", mark:"tabby", earn:"pool", blurb:{en:"The fearsome dark brown tabby who sought to rule the forest.",zh:"可怕的深棕虎斑貓，企圖統治森林。"} },
  { id:"onewhisker", en:"Onestar", zh:"一星", clan:"WindClan", role:{en:"Clan Leader",zh:"族長"}, rarity:4, coat:"#7a5a2a", eye:"#5aa84a", mark:"tabby", earn:"pool", blurb:{en:"A wiry brown tabby WindClan leader, once a friend.",zh:"結實的棕色虎斑風族族長，曾是朋友。"} }
];

WCM.clanName = function(clan){ var m={ThunderClan:{en:"ThunderClan",zh:"雷族"},RiverClan:{en:"RiverClan",zh:"河族"},WindClan:{en:"WindClan",zh:"風族"},ShadowClan:{en:"ShadowClan",zh:"影族"},StarClan:{en:"StarClan",zh:"星族"}}; var x=m[clan]||m.ThunderClan; return WCM.lang==='zh-TW'?x.zh:x.en; };
WCM.cardName = function(c){ return WCM.lang==='zh-TW'?c.zh:c.en; };
WCM.cardRole = function(c){ return WCM.lang==='zh-TW'?c.role.zh:c.role.en; };
WCM.cardBlurb = function(c){ return WCM.lang==='zh-TW'?c.blurb.zh:c.blurb.en; };
WCM.cardById = function(id){ for(var i=0;i<WCM.CARDS.length;i++) if(WCM.CARDS[i].id===id) return WCM.CARDS[i]; return WCM.CARDS[0]; };

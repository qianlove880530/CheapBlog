// 博客分类数据
export const blogCategories = [
  {
    id: "ai-basics",
    name: "AI基础知识",
    subcategories: [
      {
        id: "intro-to-ai",
        name: "AI入门",
        articles: [
          {
            id: "what-is-ai",
            title: "什么是人工智能？",
          },
          {
            id: "history-of-ai",
            title: "人工智能的发展历史",
          },
          {
            id: "types-of-ai",
            title: "人工智能的类型",
          },
        ],
      },
      {
        id: "machine-learning",
        name: "机器学习",
        articles: [
          {
            id: "ml-basics",
            title: "机器学习基础",
          },
          {
            id: "supervised-learning",
            title: "监督学习",
          },
          {
            id: "unsupervised-learning",
            title: "无监督学习",
          },
        ],
      },
    ],
  },
  {
    id: "ai-applications",
    name: "AI应用",
    subcategories: [
      {
        id: "nlp",
        name: "自然语言处理",
        articles: [
          {
            id: "chatbots",
            title: "聊天机器人",
          },
          {
            id: "translation",
            title: "机器翻译",
          },
          {
            id: "sentiment-analysis",
            title: "情感分析",
          },
        ],
      },
      {
        id: "computer-vision",
        name: "计算机视觉",
        articles: [
          {
            id: "image-recognition",
            title: "图像识别",
          },
          {
            id: "object-detection",
            title: "物体检测",
          },
          {
            id: "facial-recognition",
            title: "人脸识别",
          },
        ],
      },
    ],
  },
]

// 默认博客内容
export const defaultBlogContent = {
  title: "为什么要学习人工智能？",
  content: `
    <h2>人工智能：未来的必备技能</h2>
    <p>人工智能（AI）正在迅速改变我们的世界。从智能手机上的语音助手到自动驾驶汽车，从医疗诊断到金融分析，AI技术正在各个领域发挥越来越重要的作用。学习AI不仅可以帮助我们理解这些技术是如何工作的，还能让我们在这个快速变化的世界中保持竞争力。</p>
    
    <h3>AI的广泛应用</h3>
    <p>AI技术已经渗透到我们生活的方方面面：</p>
    <ul>
      <li>医疗保健：AI可以帮助医生更准确地诊断疾病，预测患者风险，并开发个性化治疗方案。</li>
      <li>金融：AI算法可以检测欺诈行为，优化投资组合，并提供个性化的财务建议。</li>
      <li>教育：AI可以创建个性化学习体验，帮助学生根据自己的节奏和学习风格学习。</li>
      <li>交通：自动驾驶技术正在改变我们的出行方式，提高道路安全性。</li>
    </ul>
    
    <h3>职业发展机会</h3>
    <p>随着AI技术的普及，对AI专业人才的需求也在急剧增长。学习AI可以为你打开许多职业发展的大门：</p>
    <ul>
      <li>机器学习工程师</li>
      <li>数据科学家</li>
      <li>AI研究员</li>
      <li>自然语言处理专家</li>
      <li>计算机视觉工程师</li>
    </ul>
    <p>这些职位不仅薪资丰厚，而且工作内容充满挑战和创新。</p>
    
    <h3>解决复杂问题的能力</h3>
    <p>学习AI不仅仅是学习特定的技术或算法，更是培养一种解决复杂问题的思维方式。AI研究涉及数学、统计学、计算机科学和领域专业知识的结合，这种跨学科的学习可以帮助你从多个角度思考问题，找到创新的解决方案。</p>
    
    <h3>塑造未来的机会</h3>
    <p>AI技术正处于快速发展阶段，学习AI给了你参与塑造未来的机会。你可以开发新的应用，解决重要的社会问题，或者推动AI技术向更负责任、更公平的方向发展。</p>
    
    <h3>开始学习AI的步骤</h3>
    <p>如果你对学习AI感兴趣，可以从以下几个步骤开始：</p>
    <ol>
      <li>掌握基础知识：学习编程（如Python）、线性代数、微积分和统计学。</li>
      <li>了解机器学习基础：学习监督学习、无监督学习和强化学习的基本概念。</li>
      <li>深入学习特定领域：根据你的兴趣，深入学习自然语言处理、计算机视觉或其他AI子领域。</li>
      <li>实践项目：通过实际项目应用你学到的知识，建立个人作品集。</li>
      <li>参与社区：加入AI社区，参与开源项目，与其他AI爱好者交流。</li>
    </ol>
    
    <h3>结论</h3>
    <p>学习AI是一项投资，不仅可以为你的职业发展带来机会，还可以帮助你理解和参与塑造我们的未来。无论你是学生、专业人士还是对技术感兴趣的爱好者，现在都是开始学习AI的好时机。</p>
  `,
}

// AI新闻数据
export const aiNews = [
  {
    id: "news-1",
    title: "OpenAI发布GPT-5，性能大幅提升",
    date: "2023-10-15",
    content:
      "今日，OpenAI正式发布了GPT-5模型，相比前代产品，新模型在理解能力、创造性思维和多模态处理方面都有显著提升。GPT-5不仅能够处理更长的上下文，还能更好地理解用户意图，生成更符合要求的内容。",
    source: "AI技术日报",
  },
  {
    id: "news-2",
    title: "谷歌推出新一代AI芯片，性能提升300%",
    date: "2023-10-12",
    content:
      "谷歌今天宣布推出新一代AI专用芯片TPU v5，相比上一代产品，计算性能提升了300%，同时能耗降低40%。这款芯片将用于谷歌的数据中心，为其AI服务提供更强大的计算支持。",
    source: "科技前沿",
  },
  {
    id: "news-3",
    title: "AI在医疗诊断领域取得突破性进展",
    date: "2023-10-08",
    content:
      "一项新研究表明，基于深度学习的AI系统在诊断肺癌方面的准确率已经超过了人类专家。这一系统通过分析CT扫描图像，能够识别出早期肺癌迹象，为患者提供更早的治疗机会。",
    source: "医疗科技周刊",
  },
]

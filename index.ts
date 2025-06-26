import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
// We'll skip emoji shortcode parsing and focus on our word-to-emoji mapping

// 1. Create server
const server = new McpServer({
  name: "emoji-tools-server",
  version: "1.0.0",
});

// 2. Register the "first-letter" tool
server.registerTool(
  "first-letter",
  {
    title: "First Letter Extractor",
    description: "Returns the first letter of a given word",
    inputSchema: {
      word: z.string(),
    },
  },
  async ({ word }) => ({
    content: [
      {
        type: "text",
        text: `First letter is: ${word[0]}`,
      },
    ],
  })
);

// 3. Register the "emoji-translator" tool
server.registerTool(
  "emoji-translator",
  {
    title: "Emoji Translator",
    description: "Translates text into emoji-enhanced version",
    inputSchema: {
      sentence: z.string().describe("Text to translate with emojis"),
    },
  },
  async ({ sentence }) => {
    // Common words to emoji mapping
    const wordToEmoji: Record<string, string> = {
      hello: "👋",
      hi: "👋",
      love: "❤️",
      like: "👍",
      happy: "😄",
      sad: "😢",
      good: "👍",
      bad: "👎",
      yes: "✅",
      no: "❌",
      food: "🍔",
      eat: "🍽️",
      drink: "🥤",
      water: "💧",
      sun: "☀️",
      moon: "🌙",
      star: "⭐",
      money: "💰",
      work: "💼",
      home: "🏠",
      car: "🚗",
      book: "📚",
      music: "🎵",
      time: "⏰",
      heart: "❤️",
      fire: "🔥",
      cool: "😎",
      laugh: "😂",
      cry: "😭",
      sleep: "😴",
      cat: "🐱",
      dog: "🐶",
      party: "🎉",
    };

    // Split the input sentence into words
    const words = sentence.split(" ");

    // Process each word and add emojis
    const translatedWords = words.map((word) => {
      const lowerWord = word.toLowerCase().replace(/[.,!?;:]/g, "");
      const emoji = wordToEmoji[lowerWord];

      // If we have a matching emoji, add it after the word
      return emoji ? `${word} ${emoji}` : word;
    });

    // Join the words back together
    const translatedSentence = translatedWords.join(" ");

    return {
      content: [
        {
          type: "text",
          text: translatedSentence,
        },
      ],
    };
  }
);

// 5. Register the "word-by-word-emoji" tool that adds an emoji after each word
server.registerTool(
  "word-by-word-emoji",
  {
    title: "Word-by-Word Emoji Enhancer",
    description: "Adds an appropriate emoji after each word in a sentence",
    inputSchema: {
      text: z.string().describe("Text to enhance with emojis after each word"),
    },
  },
  async ({ text }) => {
    // Expanded dictionary of word-to-emoji mappings
    const wordToEmoji: Record<string, string> = {
      // People & Emotions
      hello: "👋",
      hi: "👋",
      bye: "👋",
      goodbye: "👋",
      love: "❤️",
      hate: "💔",
      heart: "💖",
      care: "🤗",
      happy: "😄",
      sad: "😢",
      laugh: "😂",
      cry: "😭",
      smile: "😊",
      frown: "☹️",
      angry: "😠",
      worry: "😟",
      sleep: "😴",
      tired: "😫",
      sick: "🤒",
      healthy: "💪",
      cool: "😎",
      party: "🥳",
      celebrate: "🎉",
      congrats: "🎊",
      think: "🤔",
      idea: "💡",
      smart: "🧠",
      genius: "�",
      good: "👍",
      bad: "👎",
      yes: "✅",
      no: "❌",
      please: "🙏",
      thanks: "🙏",
      welcome: "🤗",
      sorry: "😔",

      // Animals
      cat: "🐱",
      dog: "🐶",
      bird: "🐦",
      fish: "🐠",
      horse: "🐴",
      cow: "🐮",
      sheep: "🐑",
      pig: "🐷",
      duck: "🦆",
      hen: "🐔",
      rabbit: "🐰",
      mouse: "🐭",
      tiger: "🐯",
      lion: "🦁",
      elephant: "🐘",
      monkey: "🐵",

      // Food & Drink
      food: "🍔",
      eat: "🍽️",
      hungry: "😋",
      full: "😌",
      breakfast: "🍳",
      lunch: "🍜",
      dinner: "🍲",
      snack: "🍿",
      pizza: "🍕",
      burger: "🍔",
      fries: "🍟",
      sandwich: "🥪",
      meat: "🥩",
      poultry: "🍗",
      salad: "🥗",
      fruit: "🍎",
      apple: "🍎",
      banana: "🍌",
      orange: "🍊",
      grape: "🍇",
      cake: "🎂",
      cookie: "🍪",
      candy: "🍬",
      chocolate: "🍫",
      coffee: "☕",
      tea: "🍵",
      water: "💧",
      juice: "🧃",
      beer: "🍺",
      wine: "🍷",
      cocktail: "🍸",
      milk: "🥛",

      // Places & Travel
      home: "🏠",
      house: "🏡",
      building: "🏢",
      school: "🏫",
      office: "🏢",
      hospital: "🏥",
      store: "🏪",
      restaurant: "🍽️",
      hotel: "🏨",
      city: "🏙️",
      town: "🏘️",
      village: "🏡",
      travel: "✈️",
      vacation: "🏖️",
      trip: "🧳",
      journey: "🛤️",
      car: "🚗",
      bus: "🚌",
      train: "🚆",
      plane: "✈️",
      ship: "🚢",
      boat: "⛵",
      bicycle: "🚲",
      walking: "🚶",
      road: "🛣️",
      bridge: "🌉",
      mountain: "⛰️",
      beach: "🏖️",
      forest: "🌳",
      river: "🏞️",
      lake: "🏞️",
      sea: "🌊",

      // Nature & Weather
      sun: "☀️",
      moon: "🌙",
      star: "⭐",
      sky: "🌌",
      cloud: "☁️",
      rain: "🌧️",
      snow: "❄️",
      wind: "🌬️",
      hot: "🔥",
      cold: "❄️",
      warm: "🌡️",
      chilly: "🥶",
      tree: "🌲",
      plant: "🌱",
      flower: "🌸",
      grass: "🌿",

      // Objects & Tools
      phone: "📱",
      computer: "💻",
      laptop: "💻",
      tv: "📺",
      camera: "📷",
      video: "📹",
      music: "🎵",
      audio: "�",
      book: "📚",
      read: "📖",
      write: "✍️",
      draw: "🎨",
      money: "💰",
      cash: "💵",
      card: "💳",
      shopping: "🛒",
      gift: "🎁",
      present: "🎁",
      key: "🔑",
      lock: "🔒",
      clock: "⏰",
      timing: "⏱️",
      calendar: "📆",
      date: "📅",
      pen: "🖊️",
      pencil: "✏️",
      paper: "📄",
      scissors: "✂️",

      // Symbols & Abstract
      peace: "☮️",
      luck: "🍀",
      magic: "✨",
      sparkle: "✨",
      warning: "⚠️",
      danger: "⚡",
      stop: "🛑",
      go: "🚦",
      up: "⬆️",
      down: "⬇️",
      left: "⬅️",
      right: "➡️",
      new: "🆕",
      top: "🔝",
      back: "🔙",
      soon: "🔜",
      check: "✅",
      cross: "❌",
      plus: "➕",
      minus: "➖",

      // Work & Activities
      work: "💼",
      job: "👔",
      meeting: "👥",
      email: "📧",
      call: "📞",
      message: "💬",
      chat: "💭",
      talk: "🗣️",
      study: "📚",
      learn: "🧠",
      teach: "👨‍🏫",
      test: "📝",
      sport: "⚽",
      game: "🎮",
      play: "🎯",
      win: "🏆",
      swim: "🏊",
      run: "🏃",
      jog: "🏃‍♂️",
      dance: "💃",

      // Technology
      internet: "🌐",
      web: "🕸️",
      browser: "🔍",
      search: "🔎",
      download: "⬇️",
      upload: "⬆️",
      install: "💾",
      update: "🔄",
      code: "👨‍💻",
      program: "💻",
      app: "📱",
      software: "⚙️",
      data: "📊",
      file: "📁",
      folder: "📂",
      save: "💾",

      // Time & Events
      today: "📅",
      tomorrow: "📆",
      yesterday: "📅",
      now: "⌚",
      morning: "🌅",
      afternoon: "🌇",
      evening: "🌆",
      night: "🌃",
      birthday: "🎂",
      wedding: "💒",
      holiday: "🏖️",
      weekend: "🎉",

      // Bengali/Bangla words
      ami: "👤",
      tumi: "👉",
      se: "👤",
      amra: "👥",
      tomra: "👥",
      tara: "👥",
      bhai: "👨‍❤️‍👨",
      bon: "👯‍♀️",
      baba: "👨‍👦",
      ma: "👩‍👧",
      khabar: "🍲",
      pani: "💧",
      bari: "🏠",
      gari: "🚗",
      boi: "📚",
      lekha: "✍️",
      valo: "👍",
      kharap: "👎",
      sundor: "🌹",
      kosto: "😔",
      khushi: "😃",
      dukkho: "😢",
      asha: "🙏",
      valobasha: "❤️",
    };

    // Process text word by word
    const words = text.split(" ");
    const enhancedWords = words.map((wordWithPunctuation) => {
      // Extract any punctuation from the end of the word
      const punctuationMatch = wordWithPunctuation.match(/([,.!?;:"\']*)$/);
      const punctuation = punctuationMatch ? punctuationMatch[0] : "";
      const word = wordWithPunctuation
        .replace(/[,.!?;:"\']$/, "")
        .toLowerCase();

      // Look up emoji for this word
      const emoji = wordToEmoji[word];

      // If we found a matching emoji, insert it before the punctuation
      if (emoji) {
        const wordWithoutPunctuation = wordWithPunctuation.substring(
          0,
          wordWithPunctuation.length - punctuation.length
        );
        return `${wordWithoutPunctuation} ${emoji}${punctuation}`;
      }

      // Otherwise return the word unchanged
      return wordWithPunctuation;
    });

    // Join the words back together
    const enhancedText = enhancedWords.join(" ");

    return {
      content: [
        {
          type: "text",
          text: enhancedText,
        },
      ],
    };
  }
);

// 6. Start communication
const transport = new StdioServerTransport();
await server.connect(transport);

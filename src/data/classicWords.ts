export const COMMON_WORDS = [
  "the", "be", "of", "and", "a", "to", "in", "he", "have", "it", "that", "for", "they", "I",
  "with", "as", "not", "on", "she", "at", "by", "this", "we", "you", "do", "but", "from",
  "or", "which", "one", "would", "all", "will", "there", "say", "who", "make", "when", "can",
  "more", "if", "no", "man", "out", "other", "so", "what", "time", "up", "go", "about", "than",
  "into", "could", "state", "only", "new", "year", "some", "take", "come", "these", "know",
  "see", "use", "get", "like", "then", "first", "any", "work", "now", "may", "such", "give",
  "over", "think", "most", "even", "find", "day", "also", "after", "way", "many", "must",
  "look", "before", "great", "back", "through", "long", "where", "much", "should", "well",
  "people", "down", "own", "just", "because", "good", "each", "those", "feel", "seem", "how",
  "high", "too", "place", "little", "world", "very", "still", "nation", "hand", "old", "life",
  "tell", "write", "become", "here", "show", "house", "both", "between", "need", "mean",
  "call", "develop", "under", "last", "right", "move", "thing", "general", "school", "never",
  "same", "another", "begin", "while", "number", "part", "turn", "real", "leave", "might",
  "want", "point", "form", "off", "child", "few", "small", "since", "against", "ask", "late",
  "home", "interest", "large", "person", "end", "open", "public", "follow", "during", "present",
  "without", "again", "hold", "govern", "around", "possible", "head", "consider", "word",
  "program", "problem", "however", "lead", "system", "set", "order", "eye", "plan", "run",
  "keep", "face", "fact", "group", "play", "stand", "increase", "early", "course", "change",
  "help", "line"
];

export const COLLEGE_WORDS = [
  "algorithm", "hypothesis", "paradigm", "cognitive", "empirical", "methodology",
  "differential", "asymptotic", "computation", "synthesis", "quantitative", "qualitative",
  "semester", "curriculum", "dissertation", "fellowship", "prerequisite", "equilibrium",
  "statistical", "heuristic", "cryptography", "thermodynamics", "microcontroller",
  "jurisprudence", "macroeconomics", "epistemology", "optimization", "determinant",
  "electromagnetism", "neuroscience", "polymorphism", "concurrency", "distributed"
];

export function generateWordList(count = 50, includeCollege = false): string {
  const source = includeCollege ? [...COMMON_WORDS, ...COLLEGE_WORDS] : COMMON_WORDS;
  const words: string[] = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * source.length);
    words.push(source[randomIndex]);
  }
  return words.join(" ");
}

export const FAMOUS_QUOTES = [
  {
    text: "Simplicity is prerequisite for reliability. Any intelligent fool can make things bigger, more complex, and more violent.",
    author: "Edsger W. Dijkstra"
  },
  {
    text: "Premature optimization is the root of all evil in software engineering. We should forget about small efficiencies about 97% of the time.",
    author: "Donald Knuth"
  },
  {
    text: "The best way to predict the future is to invent it. Perspective is worth 80 IQ points in computer science.",
    author: "Alan Kay"
  },
  {
    text: "Education is not the learning of facts, but the training of the mind to think critically about complex systems.",
    author: "Albert Einstein"
  },
  {
    text: "Talk is cheap. Show me the code. If you cannot explain it simply, you do not understand it well enough.",
    author: "Linus Torvalds"
  }
];

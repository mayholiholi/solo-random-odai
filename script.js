new Vue({
  el: '#app',
  data: {
    characterInput: '上田, 高橋, 山田, 佐藤, 鈴木, 田中, 中村, 小林',
    topicInput: '約束, 手紙, 消えた言葉, 二人だけの秘密, 腐れ縁, 夢の中, 想い出の香り, 植え付け',
    pairs: []
  },
  methods: {
    generatePairs() {
      const characters = this.parseInput(this.characterInput);
      const topics = this.parseInput(this.topicInput);
      if (characters.length === 0 || topics.length === 0) {
        alert("キャラクターとお題は少なくとも1つ以上入力してください。");
        return;
      }
      const shuffledCharacters = this.shuffleArray(characters);
      const shuffledTopics = this.shuffleArray(topics);
      this.pairs = [];
      const pairCount = Math.min(shuffledCharacters.length, shuffledTopics.length);
      for (let i = 0; i < pairCount; i++) {
        const character = shuffledCharacters[i];
        const topic = shuffledTopics[i];
        this.pairs.push({ character, topic });
      }
    },
    parseInput(text) {
      return text
        .split(/[,\n]/)
        .map(item => item.trim())
        .filter(item => item !== '');
    },
    shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }
  }
});

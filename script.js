new Vue({
  el: '#app',
  data: {
    characterInput: '上田, 高橋, 山田, 佐藤, 鈴木, 田中, 中村, 小林',
    topicInput: '約束, 手紙, 消えた言葉, 二人だけの秘密, 腐れ縁, 夢の中, 想い出の香り, 植え付け',
    pairs: []
  },
  methods: {
    generatePairs() {
      const characters = this.characterInput.split(',').map(name => name.trim()).filter(name => name !== '');
      const topics = this.topicInput.split(',').map(topic => topic.trim()).filter(topic => topic !== '');
      if (characters.length === 0 || topics.length === 0) {
        alert("キャラクターとお題は少なくとも1つ以上入力してください。");
        return;
      }
      const shuffledCharacters = this.shuffleArray(characters);
      const shuffledTopics = this.shuffleArray(topics);
      this.pairs = [];
      for (let i = 0; i < Math.max(shuffledCharacters.length, shuffledTopics.length); i++) {
        const character = shuffledCharacters[i % shuffledCharacters.length] || '';
        const topic = shuffledTopics[i % shuffledTopics.length] || '';
        this.pairs.push({ character, topic });
      }
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

import './firebase';

import Vue from 'vue';
import VueFire from 'vuefire';
import ListeVideo from './components/ListeVideo.vue';
import Addvideo from './components/AddVideo.vue';
import VueYouTubeEmbed from 'vue-youtube-embed';
import VModal from 'vue-js-modal'

Vue.use(VModal)

Vue.use(VueFire);


new Vue({
  el: '#app',
  render: h => h(ListeVideo)
});

new Vue({
  el: '#addVideo',
  render: h => h(Addvideo)
});






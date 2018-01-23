<template>
  <div class="liqte">
    <div id="listeVideo">
    <table class="table table-striped" style='table-layout:fixed'>
      <thead>
        <tr>
          <th width="200">Name</th>
          <th width="200">Description video</th>
          <th width="300">Video</th>
          <th width="200">delete</th>
          <th width="200">modifier</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="video in videos">
          <td> {{video.nom}}</td>

          <td ><span v-bind:id="video.id+' '+video.description" style="display:none;">{{video.description}}</span></td>         
          <td>
              <youtube :video-id="video.id" v-bind:id="video.id" ref="youtube" @playing="playing(video.id+' '+video.description)"  @paused="paused(video.id+' '+video.description)" height=200 width=360  ></youtube>
          </td>
          <td><span class="glyphicon glyphicon-trash" aria-hidden="true" v-on:click="removeVideo(video)"></span></td>
          <td><span class="glyphicon glyphicon-pencil" aria-hidden="true" v-on:click="show(video)"></span></td>
        </tr>
      </tbody>
    </table>
    </div>
    <modal name="popupModify">
      
        <form id="form" class="form-inline" v-on:submit.prevent="changeVideo">
          <div class="form-group">
            <label for="VideoTitle">Nouveau Titre</label>
            <textarea id="VideoTitle" class="form-control" v-model="videoToChange.nom"></textarea>
            <br/>
            <label for="VideoDescription">Nouvelle description</label>
            <textarea id="VideoDescription" class="form-control" v-model="videoToChange.description"></textarea>
          </div>
          <br/>
          <input type="submit" class="btn btn-primary" value="Change video">
        </form>

    </modal>

  </div>

</template>

<script>
import {db} from '../firebase';
let refVideos = db.ref('videos');
//console.log(refVideos.)

import Vue from 'vue'
import VueYoutube from 'vue-youtube'



Vue.use(VueYoutube)


export default {
  name: 'ListeVideo',
  data() {
    return {
      videoToChange :
      {
          nom: '',
          description:'',
          video:'' // j'en ai besoin pour savoir quel video subira les modifications
      }
    }
  },
  methods: {
    changeVideo: function () {
      refVideos.child(this.videoToChange.video['.key']).child('description').set(this.videoToChange.description);
      refVideos.child(this.videoToChange.video['.key']).child('nom').set(this.videoToChange.nom);
      this.hide();
    },
    removeVideo: function (video) {
      refVideos.child(video['.key']).remove();
    },

    playing(idDescription) {
      document.getElementById(idDescription).style.display = "block"
    },
    paused(idDescription){
      console.log('video paused');
      document.getElementById(idDescription).style.display = "none";
    },
    show (video) {
    this.videoToChange.description = ''; // on reset l'affichage des textarea
    this.videoToChange.nom = '';
    this.videoToChange.video = '';
    this.$modal.show('popupModify');
    this.videoToChange.video = video;
    },
    hide () {
      this.$modal.hide('popupModify');
      
      

    },

  },
  computed: {
    player () {
      return this.$refs.youtube.player
    }
  },  
  firebase: {
    videos: {
      source: refVideos,
      cancelCallback(err) {
        console.error(err);
      }
    }
  }
}
</script>
<style>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

</style>
// API KEY :  AIzaSyC5WnuOJlcPmcxpNpKwBTBr6hzE3yCeKy4 

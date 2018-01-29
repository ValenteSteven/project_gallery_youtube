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
          <th width="200">modify</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="video in videos">
          <td v-if ="video.id != null"> {{video.nom}}</td>

          <td v-if ="video.id != null"><span  v-bind:id="video.id+' '+video.description" style="display:none; height: 200px;overflow-y: scroll;">{{video.description}}</span></td>         
          <td v-if ="video.id != null">
              <youtube :video-id="video.id" v-bind:id="video.id" ref="youtube" @playing="playing(video.id+' '+video.description)"  @paused="paused(video.id+' '+video.description)" height=200 width=360  ></youtube>
          </td>
          <td v-if ="video.id != null"><span class="glyphicon glyphicon-trash" aria-hidden="true" v-on:click="removeVideo(video)"></span></td>
          <td v-if ="video.id != null"><span class="glyphicon glyphicon-pencil" aria-hidden="true" v-on:click="show(video)"></span></td>
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
    <input type="button" class="btn btn-primary" id="buttonPrevious" value="Previous" v-on:click="previous()" />
    <input type="button" class="btn btn-primary" id="buttonNext" value="Next" v-on:click="next()" />
  </div>

</template>

<script>
import {db} from '../firebase';
var minIdByTime = 0;
var maxIdByTime = 0;
var minRegistered = false;
var refVideos = db.ref('videos').orderByChild('idByTime').startAt("0").limitToFirst(3);
refVideos.on('value', function(snapshot) {
  snapshot.forEach(function(childSnapshot) {
    if (!minRegistered) {
      minIdByTime = childSnapshot.val().idByTime;
      console.log("premier chargement, voila le minimum : "+ minIdByTime);
      minRegistered = true;
    }
    maxIdByTime = childSnapshot.val().idByTime;
     console.log("premier chargement, voila le maximum : "+ maxIdByTime);
    console.log(childSnapshot.val().idByTime);
  });
});
var refVideos2 = db.ref('videos');
console.log(refVideos2);



import Vue from 'vue'
import VueYoutube from 'vue-youtube'



Vue.use(VueYoutube)


export default {
  name: 'ListeVideo',
  data() {
    return {
      //Allvideos : [],
      page:0,
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
      refVideos2.child(this.videoToChange.video['.key']).child('description').set(this.videoToChange.description);
      refVideos2.child(this.videoToChange.video['.key']).child('nom').set(this.videoToChange.nom);
      this.hide();
    },
    removeVideo: function (video) {
      console.log(refVideos2);
      refVideos2.child(video['.key']).remove();
    },
    next : function(){
      //refVideos = db.ref('videos').orderByChild("idByTime").startAt((parseInt(maxIdByTime) + 1).toString()).limitToFirst(1);
      document.getElementById("buttonNext").disabled=true;
      document.getElementById("buttonPrevious").disabled=false;
      console.log("avant next" + maxIdByTime);
      var newListVideo = db.ref('videos').orderByChild("idByTime").startAt((parseInt(maxIdByTime) + 1).toString()).limitToFirst(3);
      var minRegistered = false;
      // en fait apparaitre curieusement 2 au lieu de 1, bizarre ...
        newListVideo.on('value', function(snapshot) {
          snapshot.forEach(function(childSnapshot) {
            if (!minRegistered) {
              minIdByTime = childSnapshot.val().idByTime;
              console.log("j'ai appuye sur next, et voila le minimum dans la promesse : "+minIdByTime);
              minRegistered = true;
            }
            maxIdByTime = childSnapshot.val().idByTime;
            console.log("j'ai appuye sur next, et voila le maximum dans la promesse : "+maxIdByTime);
          });
        });
        this.$bindAsArray('videos', newListVideo);
      setTimeout(function () { // on attend un peu pour laisser l'id max et min se mettre a jour, pas terrible ...
        console.log("apres passage dans la promesse, voila le min:"+ minIdByTime);
        console.log("apres passage dans la promesse, voila le max:"+ maxIdByTime);
      document.getElementById("buttonPrevious").disabled=false;
      newListVideo = db.ref('videos').orderByChild("idByTime").startAt((parseInt(maxIdByTime) + 1).toString()).limitToFirst(1);
      newListVideo.on('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
         if (typeof childSnapshot.val().idByTime !== "undefined"){
          console.log("salut " + childSnapshot.val().idByTime );
          document.getElementById("buttonNext").disabled=false;
         }
        });
      });
      console.log(childSnapshot.val().idByTime);},500);
      

    },
    previous : function(){
      document.getElementById("buttonNext").disabled=false;
      document.getElementById("buttonPrevious").disabled=true;
      var minRegistered = false;
      var newListVideo = db.ref('videos').orderByChild("idByTime").endAt((parseInt(minIdByTime) - 1).toString()).limitToLast(3);
      // en fait apparaitre curieusement 2 au lieu de 1, bizarre ...

      newListVideo.on('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          if (!minRegistered) {
            minIdByTime = childSnapshot.val().idByTime;
            minRegistered = true;
          }
        maxIdByTime = childSnapshot.val().idByTime;
        console.log(childSnapshot.val().idByTime);
        });
      });
      this.$bindAsArray('videos', newListVideo);
      setTimeout(function () {

      newListVideo = db.ref('videos').orderByChild("idByTime").endAt((parseInt(minIdByTime) - 1).toString()).limitToLast(1);
      newListVideo.on('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
         if (typeof childSnapshot.val().idByTime !== "undefined"){
          console.log("salut " + childSnapshot.val().idByTime );
          document.getElementById("buttonPrevious").disabled=false;
         }
        });
      });},500);
    },
    playing(idDescription) {
      document.getElementById(idDescription).style.display = "block";
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
    }

  },
  computed: {
    player () {
      return this.$refs.youtube.player
    }
  }, 
  mounted() {
    // le bouton previous est forcement desactivé
    document.getElementById("buttonPrevious").disabled=true;
    /*console.log("salut" + this.Allvideos);
    refVideos2.on('value', function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        this.Allvideos.push(childSnapshot.val())
      });
    });*/
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

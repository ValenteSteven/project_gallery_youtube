<template>
    <div class="panel panel-default">
      <div class="panel-heading">
        <h3 class="panel-title">Add New Videos</h3>
      </div>
      <div class="panel-body">
         <form id="form" class="form-inline" v-on:submit.prevent="addVideo">
          <div class="form-group">
            <label for="VideosUrl">Url:</label>
            <input type="text" id="VideosUrlUrl" class="form-control" v-model="newVideo.Url">
          </div>
          <input type="submit" class="btn btn-primary" value="Add video">
        </form>
      </div>
    </div>   
</template>

<script>
import {db} from '../firebase';
let refVideos = db.ref('videos');


export default {
  name: 'AddVideo',
  data() {
    return {
      newVideo: {
          Url: '',
          nom: '',
          id:'',
          description:''
      }
    }
  },
  methods: {
    addVideo: function () {
      var urlCoupe = this.newVideo.Url.split('v=')[1]; //je recupere ici l'id de la video ... mais qui peut etre suivi d'autre chose !
      var id = urlCoupe.split('&')[0] // je supprime tout ce qui pourrait suivre l'id de la video par prudence
      this.newVideo.id = id

      const req = new XMLHttpRequest();
      req.open('GET', 'https://www.googleapis.com/youtube/v3/videos?part=snippet&id='+id+'&fields=items/snippet/title,items/snippet/description&key=AIzaSyC5WnuOJlcPmcxpNpKwBTBr6hzE3yCeKy4', false); 
      req.send( null );
      var reponse = JSON.parse(req.responseText)
      this.newVideo.description = reponse.items[0].snippet.description;
      this.newVideo.nom = reponse.items[0].snippet.title;

      refVideos.push(this.newVideo);
      this.newVideo.nom = '';
      this.newVideo.Url = '';
      this.newVideo.id = '';
      this.newVideo.description = '';

      this.show();
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
}
</script>
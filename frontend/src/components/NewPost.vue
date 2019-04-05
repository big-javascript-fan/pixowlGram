<template>
    <v-container>
        <v-layout row wrap>
            <v-flex lg4 xs4 sm4 md3 offset-xs1 offset-lg1>
                <picture-input
                    ref="pictureInput"
                    @change="onChanged"
                    @remove="onRemoved"
                    :width="500"
                    :removable="true"
                    removeButtonClass="ui red button hidden"
                    :height="500"
                    accept="image/jpeg, image/png, image/gif"
                    buttonClass="ui button primary hidden"
                    :customStrings="{
                        upload: '<h1>Upload it!</h1>',
                        drag: 'Drag and drop your image here'
                        }">
                </picture-input>
            </v-flex>
            <v-flex lg4 xs10 sm10 md4 offset-xs1 offset-lg3 align-center justify-center fill-height>
                <div>
                    <textarea v-model="description" rows="10" cols="50"></textarea>
                </div>
                <div>
                    <button @click="attemptUpload" v-bind:class="{disabled: !image}">
                        Upload
                    </button>
                </div>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import axios from 'axios';
import PictureInput from 'vue-picture-input';

function upload(url, file, description, name='avatar') {
    if(typeof url !== 'string') {
        throw new TypeError(`Expected a string, got ${typeof url}`);
    }

    const formData = new FormData();
    formData.append(name, file);
    formData.append('description', description);
    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    };
    return axios.post(url, formData, config);
}

export default {
    name: 'NewPost',
    data: {
        image: '',
        description: ''
    },
    components: {
        PictureInput
    },
    methods: {
        onChanged: function() {
            console.log("New picture uploaded");
            console.log(this.description);
            if(this.$refs.pictureInput.file) {
                this.image = this.$refs.pictureInput.file;
            } else {
                console.log("Old browser, No suppport for Filereader API");
            }
        },
        onRemoved: function() {
            this.image = '';
        },
        attemptUpload: function() {
            if(this.image) {
                upload('http://localhost:3000/uploads', this.image, this.description)
                    .then(response => {
                        if(response.data.success) {
                            this.image = '';
                            console.log("Image uploaded successfully");
                        }
                    })
                    .catch(err => {
                        console.error(err);
                    });
            }
        }
    }
}

</script>

<style scoped>
.hidden {
    display: none;
}
</style>

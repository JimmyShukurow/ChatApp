<template>
  <q-page class="row items-center justify-evenly">
    <q-card class="main-area">
      <div class="messages" >
        <p class="title">Springboot and Vue3 Quasar Stomp-Websocket</p>
        <q-separator />
        <div class="messages--body">
          <div id="scrollArea" class="messages--conversation-area">
            <template v-for="message in store.getContent" :key="message">
              <span v-html="message" ref="scrollToMe"></span>
            </template>
          </div>
        </div>
      </div>
      <q-form
        @submit.prevent="sendMessage"
        class="messages--input"
      >
        <q-input
          outlined
          v-model="message"
          class="second-input"
          dense
          @focus="message = message == placeholder ? '' : message"
        ></q-input>
        <q-btn
          id="jimi"
          :label="label"
          class="send-button shadow-1"
          icon-right="send"
          no-caps
          unelevated
          @click="sendMessage"
        />
      </q-form>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { send } from 'src/socket';
import { useMessageStore } from 'src/stores/message-store';
import { useQuasar } from 'quasar';
import { bus } from 'src/socket';


const store = useMessageStore();
const label = ref('Send');
const scrollToMe = ref(null);

let placeholder = 'Type a message here ...';

const message = ref(placeholder);
const $q = useQuasar();

function sendMessage() {
  if (message.value === placeholder || message.value === '') {
    $q.notify({
      message: 'Write something!',
      color: 'negative',
    });
    return;
  }
  send(store.getUsername, message.value);
  message.value = '';
}
const hideLabel = () => {
  let button = document.getElementById('jimi');
  let width = button?.offsetWidth;
  if (width < 100) {
    label.value = '';
  }
};

bus.on('scroll',()=>{
scrollToElement()
})

const scrollToElement = () => {
  const el = document.getElementById('scrollArea');
  const lastMessage = el.lastElementChild;
  lastMessage?.scrollIntoView()

  // if (lastMessage) {
  //   lastMessage.scrollIntoView({
  //     behavior: 'smooth',
  //     block: 'end', // Adjust this to 'start' or 'center' if needed
  //     inline: 'nearest', // Adjust this to 'start' or 'center' if needed
  //   });
  // }
};

onMounted(() => {
  hideLabel();
});
</script>

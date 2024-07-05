<script >
  import Notification from './../lib/components/Notification.svelte';
	import NewMain from './../lib/components/NewMain.svelte';
	import EmptyState from './../lib/components/EmptyState.svelte';

  import config from '../lib/stores/config'
  import members from '../lib/stores/members'
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';
  import { onMount, onDestroy, getContext } from 'svelte';
  import messaging from '$lib/constants/messaging'
  
  let message = ''
  let messageType = messaging.MESSAGE_TYPE.INFO
  let notificationTimeout = null

  const triggerNotification = (notificationMessage, notificationType = messaging.MESSAGE_TYPE.SUCCESS) => {
    message = notificationMessage
    messageType = notificationType
    notificationTimeout = setTimeout(() => {
      message = ''
      messageType = messaging.MESSAGE_TYPE.INFO
      clearTimeout(notificationTimeout)
    }, 3000) 
  }
  
  const canvasPosition = tweened(0, {
		duration: 400,
		easing: cubicOut
	});

 $: {
  if ($config.isSidebarVisible) {
   canvasPosition.set(-300)
  } else {
   canvasPosition.set(0)
  }
 }  
 
</script>

<main>
  {#if message}
    <Notification {message} type={messageType} timing={messaging.TIMING} />
  {/if}
  <div class='main' style:transform={'translateX(' + $canvasPosition + 'px)'}>
  {#if $members.filteredMembers?.length}
    <NewMain {triggerNotification}/>
  {:else}
    <EmptyState/>
  {/if}
  </div>
</main>

<style>
   .main {
    display: flex;
    width: 100%;
    align-items: center;
    flex-direction: column;
  }
</style>

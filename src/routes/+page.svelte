<script >
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';
  import { onMount, onDestroy, getContext } from 'svelte';
	
  import CanvasController from './../lib/components/CanvasController.svelte';
  import Notification from './../lib/components/Notification.svelte';
	import EmptyState from './../lib/components/EmptyState.svelte';

  import config from '../lib/stores/config'
  import members from '../lib/stores/members'
  
  import messaging from '$lib/constants/messaging'
  
  /**
   * Following variables(message, messageType & notificationTimeout) handle notification component for the page
  */
  let message = ''
  let messageType = messaging.MESSAGE_TYPE.INFO
  let notificationTimeout = null

  /**
   * Triggers a notification with the specified message and type.
   *
   * @param {string} notificationMessage - The message to be displayed in the notification.
   * @param {string} notificationType - The type of the notification. Defaults to 'SUCCESS'.
   */
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

 
  /**
   * Following observer handlers the movement of main cavas container to left,
   * in case sidebar is open. This is done via moving the canvas-container to left, if sidebar shows up.
  */
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
    <CanvasController {triggerNotification}/>
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

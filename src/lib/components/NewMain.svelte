<script>
	import Notification from './Notification.svelte';
	import { Fabric } from './../helpers/Fabric.js';
	import { onDestroy, onMount } from 'svelte';
 import members from '$lib/stores/members'
 import shortlist from '$lib/stores/shortlist'
 import config from '$lib/stores/config'
 import messaging from '../constants/messaging'
 

 export let triggerNotification;

 let canvasRef;
 let fabricInstance;
 let notificationTimeout = null;
 let message = ''

 const addToSidebarShortlist = (canvasInstance) =>  {
    if (!canvasInstance) return null;

    let shouldAddToShortlist = false
    const id = canvasInstance.getActiveObject().id;
    shouldAddToShortlist = !$shortlist.members.includes(id) 
    
    const dataURL = canvasInstance.getActiveObject().toDataURL()
    const oldImageDataURLs = $shortlist.imageDataURLs
    
    const newMembers = shouldAddToShortlist
      ? [...$shortlist.members, id]
      : $shortlist.members  

    
    const imageDataURLs = shouldAddToShortlist
      ? [...oldImageDataURLs, dataURL]
      : oldImageDataURLs
    
    $shortlist = {
      ...$shortlist,
      members: newMembers,
      imageDataURLs,
      count: newMembers.length
    }
     
    triggerNotification(shouldAddToShortlist ? `User ${id} added to Shortlist` : '')

 }

 const bindSaveToShortlistHandler = (event) => {
  if (event.altKey && event.code === 'KeyS') {
   event.preventDefault()
   if (fabricInstance.getInstance()) {
    addToSidebarShortlist(fabricInstance.getInstance())
   }
  }
 }
 console.log($members.allMembers.length)
 onMount(() => {
  fabricInstance = new Fabric(
   canvasRef,
   {width: 300, height: 100},
   {width: 900, height: 3650},
   1,
   20,
   $config.isZoomPanEnabled
  )
  
  document.addEventListener('keydown', (event) => bindSaveToShortlistHandler(event));
 })

 onDestroy(() => {
  fabricInstance.unmount()
  document.removeEventListener('keydown', (event) => bindSaveToShortlistHandler(event));
 })
 $:{
  if (fabricInstance?.getInstance()) {
   fabricInstance?.clearInstance()
   fabricInstance?.setZoomPan($config.isZoomPanEnabled)
   fabricInstance?.renderAllMembers($members.filteredMembers, $members.usersImageData)   
  }
 }
</script>

 <div class='canvas-container'>
   <canvas bind:this={canvasRef} class="canvas-main" > </canvas>
 </div>

<style>
  .canvas-container{
    display: flex;
    flex-direction: column;
    width: 900px;
    height: 800px;
    align-items: center;
    overflow: hidden;
    overflow-y: scroll;
    border-radius: 12px;
    margin: 12px;
    backdrop-filter: blur(30px);
    -webkit-box-shadow: 3px 2px 20px -3px rgba(0,0,0,0.75);
    -moz-box-shadow: 3px 2px 20px -3px rgba(0,0,0,0.75);
    box-shadow: 3px 2px 20px -3px rgba(0,0,0,0.75);
  }
  canvas {
    display: flex;
		margin: 0 auto;
    align-items: center;
  }
</style>
<script>
	import Notification from './Notification.svelte';
	import { Fabric } from '../helpers/Fabric.js';
	import { onDestroy, onMount } from 'svelte';
 import members from '$lib/stores/members'
 import shortlist from '$lib/stores/shortlist'
 import config from '$lib/stores/config'
 import messaging from '../constants/messaging'
 
 // triggerNotification is a function received from Page.svelte file. This is responsible to send notifications when user is shortlisted
 export let triggerNotification;

 // Reference for out canvas container to be provided to fabric while instantiation.
 let canvasRef;

 // This will hold our fabricInstance once initialized
 let fabricInstance;


 /**
  * Responsible for exporting (adding to shortlist) our selected component.
  * This takes the active object from the canvasInstance), validates for duplicate id,
  * which we have given while creating the component (inside fabric). If no duplicates 
  * found, it converts it into dataUrl and saves it in shortlist store.
  * 
  * Once done, it sends a notification
 */
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

 /**
  * This binds our OPTION/ALT + S key to the add to shortcut functionality. We bind this 
  * event onMound and remove it onDestroy
 */
 const bindSaveToShortlistHandler = (event) => {
  if (event.altKey && event.code === 'KeyS') {
   event.preventDefault()
   if (fabricInstance.getInstance()) {
    addToSidebarShortlist(fabricInstance.getInstance())
   }
  }
 }

 onMount(() => {
  /**
   * OnMount, a new fabric instance is created using card widths and screen width as bellow.
  */
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
  // OnDestroy, we call fabricInstance's unmount, which is a master unmount for all fabric canvas
  // related bound events
  fabricInstance.unmount()
  document.removeEventListener('keydown', (event) => bindSaveToShortlistHandler(event));
 })
 

// Observer responsible to re-render our canvas on the basis of changes
 $:{
  // Check if fabricInstance exists and has been initialized
  if (fabricInstance?.getInstance()) {
   // Clear the existing fabric instance
   fabricInstance?.clearInstance()
   // Set the zoom and pan settings based on the config
   fabricInstance?.setZoomPan($config.isZoomPanEnabled)
   // re-render all the members on the canvas using the filtered members and user's image data
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
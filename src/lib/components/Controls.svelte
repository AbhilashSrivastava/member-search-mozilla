<script>
 export let onSideBarClicked;
 export let onZoomPanClicked;
 export let isSidebarVisible;
 export let isZoomPanEnabled 
</script>

<div class='controls'>
   <button class='sidebar-button' on:click={onSideBarClicked}>{isSidebarVisible ? 'Close Sidebar' : 'Open Sidebar'}</button>
   <button class='panzoom-button' on:click={onZoomPanClicked}>Zoom/Pan {isZoomPanEnabled ? ' Off' : ' On'}</button>
</div>

<style>
   .controls{
    position: absolute;
    padding: 12px;
    top: 100px;
    left: 0px;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: space-between;
    height: 100px;
    color: white;
    z-index: 10;
    width: 165px;
    backdrop-filter: blur(50px);
    border: 1px solid #ffffff40;
    border-top-right-radius: 12px;
    border-bottom-right-radius: 12px;
  }
   button {
    padding: 6px 19px;
    border-radius: 12px;
    color: white;
    white-space: nowrap;
  }

  .sidebar-button {
    background-color: #593893;
  }
  .panzoom-button {
   background-color: #611e30; 
  }
</style>
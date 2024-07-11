<script>
	import Controls from './../lib/components/Controls.svelte';
	import Notification from './../lib/components/Notification.svelte';
  import 'modern-normalize/modern-normalize.css';
  import '../styles/main.scss';
	import Sidebar from './../lib/components/Sidebar.svelte';
  import SearchField from '$lib/components/SearchField.svelte'
  import { onMount, onDestroy, setContext } from 'svelte';
  import { fetchMembers} from '../services/githubService'
  import { tweened } from 'svelte/motion';
  import config from '../lib/stores/config'
  import members from '../lib/stores/members'
  import messaging from '$lib/constants/messaging'
  import { cubicOut } from 'svelte/easing';
  import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';

  injectSpeedInsights();

  /**
   * Following variables(message, messageType & notificationTimeout) handle notification component for the page
  */
  let message = ''
  let messageType = messaging.MESSAGE_TYPE.INFO
  let notificationTimeout = null
  
  let searchTerm = ''
  
  const sidebarWidth = tweened(0, {
		duration: 400,
		easing: cubicOut
  })
    
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

  /**
   * Toggles the visibility of the sidebar.
   * In case sidebar is toggled on/off, it also shows a message.
   * Changes the store's value to persist it in the config
   */
  const toggleSidebar = () => {
    $config.isSidebarVisible = !$config.isSidebarVisible
    sidebarWidth.set($config.isSidebarVisible ? 400 : 0)
    triggerNotification(`Sidebar is ${$config.isSidebarVisible ? 'visible': 'hidden'}`, messaging.MESSAGE_TYPE.INFO)
  }
  
  
  /**
   * Toggle the Pan/Zoom mode vs Scroll Mode for the cards.
   * Changes the same and stores in the store.
   * Triggers notification whenever the value is toggled
   */
  const toggleZoomPanMode = () => {
    $config.isZoomPanEnabled = !$config.isZoomPanEnabled
    triggerNotification(`Pan/Zoom Mode is ${$config.isZoomPanEnabled ? 'On': 'Off'}`, messaging.MESSAGE_TYPE.INFO)
  }

  const handleSearch = (term) => {
    searchTerm = term;
  }

  /**
   * Updates the filteredMembers array based on the searchTerm value.
   * If the searchTerm is not empty, filters the allMembers array to include only members whose login includes the searchTerm (case-insensitive).
   * If the searchTerm is empty, assigns the allMembers array to the filteredMembers array -> to show all members as default
   */
  $: {
    $members.filteredMembers = searchTerm.length > 0 
      ? $members.allMembers.filter((member) =>
          member.login.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : $members.allMembers
  }

  // Fetch members data and update the store variables on component mount
  onMount(async () => {
    const list = await fetchMembers();
    $members.allMembers = list.users
    $members.filteredMembers = list.users
    $members.usersImageData = list.usersImageData
  });

  // remove the members list from the store on unmount. Set the config values in store as false, on unmount
  onDestroy(() => {
    $members.allMembers = []
    $members.filteredMembers = []
    $config.isZoomPanEnabled = false
    $config.isSidebarVisible = false
  })

</script>

<main>
  {#if message}
    <Notification {message} type={messageType} timing={messaging.TIMING} />
  {/if}
  <Sidebar width={sidebarWidth} />
  <SearchField 
    onSearch={handleSearch} 
  />
  <Controls    
    onSideBarClicked={toggleSidebar} 
    onZoomPanClicked={toggleZoomPanMode}
    isSidebarVisible={$config.isSidebarVisible} 
    isZoomPanEnabled={$config.isZoomPanEnabled}
  />
  <slot />
</main>

<style>

  main{
    height: 100vh;
    background-color: rgba(255, 255, 255, 0.4);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    background: url(https://githubuniverse.com/og-image-24.jpg) no-repeat center;
    background-size: cover;
  }

</style>
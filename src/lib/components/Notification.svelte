<script>
    import { onMount } from "svelte";
    import { spring } from "svelte/motion";
    import { fly } from "svelte/transition";
    import { cubicOut } from "svelte/easing";
  
    // Props received by this component
    export let message = "";
    export let type = "info";
    export let timing = 3000;
    
    // Initializing variables
    let show = false;
    let y = spring(-100, { stiffness: 0.1, damping: 0.3 });
    
    // Running code when the component is mounted
    onMount(() => {
      show = true;
      y.set(0);
    
      // Setting a timer to hide the notification after a certain duration
      const timer = setTimeout(() => {
      y.set(-100);
      show = false;
      }, timing);
    
      // Clearing the timer when the component is unmounted
      return () => clearTimeout(timer);
    });
    
    // Generating the CSS classes for the notification
    const notificationClasses = `notification ${type}`;
  </script>
  
  <style>
    .notification {
      position: fixed;
      top: 1rem;
      left: 1rem;
      padding: 1rem;
      border-radius: 0.5rem;
      color: white;
      font-weight: bold;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
  
    .info {
      background-color: #342298;
    }
  
    .success {
      background-color: #35d24d;
    }
  
    .error {
      background-color: #892f35;
    }
  
    .warning {
      background-color: #e6d46f;
      color: #333;
    }
  </style>
  
  {#if show}
    <div class={notificationClasses} transition:fly="{{ y: 200, duration: 400, easing: cubicOut }}">
      {message}
    </div>
  {/if}
  
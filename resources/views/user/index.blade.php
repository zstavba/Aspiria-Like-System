  @include('user.partials.upload_image')
<!-- This example requires Tailwind CSS v2.0+ -->
<div class="h-screen flex overflow-hidden">
  @include('user.partials.mobile_sidebar')

  <!-- Static sidebar for desktop -->
  @include('user.partials.sidebar')
  <div class="flex flex-col w-0 flex-1 overflow-hidden">
    <div class="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3">
      <button class="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
        <span class="sr-only">Odpri meni</span>
        <!-- Heroicon name: outline/menu -->
        <svg class="h-6 w-6 text-gray-400 group-hover:text-gray-500"  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>
    <main class="flex-1 relative z-0 overflow-y-auto focus:outline-none p-4" tabindex="0">
 		aaaaa
    </main>
  </div>
</div>

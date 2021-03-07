  @include('user.partials.upload_image')
<!-- This example requires Tailwind CSS v2.0+ -->
<div class="h-screen flex overflow-hidden" ng-controller="UserController" ng-init="init('{{ Auth::user()->id }}')">
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
        <div class="rounded rounded-t-lg overflow-hidden shadow max-w-xs my-3 bg-white shadow" ng-repeat="member in members">
            <img src="https://i.imgur.com/dYcYQ7E.png" class="w-full" />
            <div class="flex justify-center -mt-8">
                <img src="@{{ member.profile }}" class="rounded-full border-solid border-white border-2 -mt-3 w-20 h-20">   
            </div>
          <div class="text-center px-3 pb-6 pt-2">
            <h3 class="text-black text-sm bold font-sans">@{{ member.name }}</h3>
          </div>
            <div class="flex justify-center pb-3 text-grey-dark">
              <div class="text-center mr-3 border-r pr-3">
                <h2>0</h2>
                <span>Slike</span>
              </div>
              <div class="text-center">
                <h2>0</h2>
                <span>Prijatelji</span>
              </div>
            </div>
        </div>
    </main>
  </div>
</div>

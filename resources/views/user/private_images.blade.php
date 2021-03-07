  @include('user.partials.upload_image')
   @include('user.partials.change_name')
<!-- This example requires Tailwind CSS v2.0+ -->
<div class="h-screen flex overflow-hidden">
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
      <div class="grid grid-cols-3 gap-4">
          <article class="overflow-hidden rounded-lg shadow-lg bg-white relative" ng-repeat="image in private_images">
            <a href="#">
              <img alt="Placeholder" class="block h-60 w-full" src="@{{ image.path }}">
            </a>
            <button class=" absolute right-3 top-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" ng-click="changeName(image.id)">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs" version="1.1" x="0" y="0" viewBox="0 0 477.873 477.873" style="enable-background:new 0 0 512 512" xml:space="preserve" class="">
                <g>
                  <g xmlns="http://www.w3.org/2000/svg">
                    <g>
                      <path d="M392.533,238.937c-9.426,0-17.067,7.641-17.067,17.067V426.67c0,9.426-7.641,17.067-17.067,17.067H51.2    c-9.426,0-17.067-7.641-17.067-17.067V85.337c0-9.426,7.641-17.067,17.067-17.067H256c9.426,0,17.067-7.641,17.067-17.067    S265.426,34.137,256,34.137H51.2C22.923,34.137,0,57.06,0,85.337V426.67c0,28.277,22.923,51.2,51.2,51.2h307.2    c28.277,0,51.2-22.923,51.2-51.2V256.003C409.6,246.578,401.959,238.937,392.533,238.937z" fill="#fffafa" data-original="#000000" style="" class=""/>
                    </g>
                  </g>
                  <g xmlns="http://www.w3.org/2000/svg">
                    <g>
                      <path d="M458.742,19.142c-12.254-12.256-28.875-19.14-46.206-19.138c-17.341-0.05-33.979,6.846-46.199,19.149L141.534,243.937    c-1.865,1.879-3.272,4.163-4.113,6.673l-34.133,102.4c-2.979,8.943,1.856,18.607,10.799,21.585    c1.735,0.578,3.552,0.873,5.38,0.875c1.832-0.003,3.653-0.297,5.393-0.87l102.4-34.133c2.515-0.84,4.8-2.254,6.673-4.13    l224.802-224.802C484.25,86.023,484.253,44.657,458.742,19.142z M434.603,87.419L212.736,309.286l-66.287,22.135l22.067-66.202    L390.468,43.353c12.202-12.178,31.967-12.158,44.145,0.044c5.817,5.829,9.095,13.72,9.12,21.955    C443.754,73.631,440.467,81.575,434.603,87.419z" fill="#fffafa" data-original="#000000" style="" class=""/>
                    </g>
                  </g>
                  <g xmlns="http://www.w3.org/2000/svg">
                  </g>
                  <g xmlns="http://www.w3.org/2000/svg">
                  </g>
                  <g xmlns="http://www.w3.org/2000/svg">
                  </g>
                  <g xmlns="http://www.w3.org/2000/svg">
                  </g>
                  <g xmlns="http://www.w3.org/2000/svg">
                  </g>
                  <g xmlns="http://www.w3.org/2000/svg">
                  </g>
                  <g xmlns="http://www.w3.org/2000/svg">
                  </g>
                  <g xmlns="http://www.w3.org/2000/svg">
                  </g>
                  <g xmlns="http://www.w3.org/2000/svg">
                  </g>
                  <g xmlns="http://www.w3.org/2000/svg">
                  </g>
                  <g xmlns="http://www.w3.org/2000/svg">
                  </g>
                  <g xmlns="http://www.w3.org/2000/svg">
                  </g>
                  <g xmlns="http://www.w3.org/2000/svg">
                  </g>
                  <g xmlns="http://www.w3.org/2000/svg">
                  </g>
                  <g xmlns="http://www.w3.org/2000/svg">
                  </g>
                </g>
              </svg>
            </button>
            <header class="flex items-center justify-between leading-tight p-2 md:p-4">
                <h1 class="text-lg">
                    <a class="no-underline hover:underline text-black" href="#">
                        @{{ image.title }}
                    </a>
                </h1>
                <p class="text-grey-darker text-sm">
                    @{{ image.created }}
                </p>
            </header>
            <footer class="flex items-center justify-between leading-none p-2 md:p-4">
                <a class="flex items-center no-underline hover:underline text-black" href="#">
                    <img alt="Placeholder" class="block rounded-full w-10 h-10" src="@{{ image.user.profile }}">
                    <p class="ml-2 text-sm">
                        @{{ image.user.name }}
                    </p>
                </a>
                <div class="inline-block pull-right" ng-if="image.user.id != {{ Auth::user()->id }}">
                    <button type="button" class="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 mr-5 text-white">
                        <svg width="20" height="20" stroke="currentColor" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 9.5C18 10.3284 17.3285 11 16.5 11C15.6716 11 15 10.3284 15 9.5V3.5C15 2.67157 15.6716 2 16.5 2C17.3285 2 18 2.67157 18 3.5V9.5Z" fill="#fff"/>
                        <path d="M14 9.66667V4.23607C14 3.47852 13.572 2.786 12.8945 2.44721L12.8446 2.42229C12.2892 2.14458 11.6767 2 11.0558 2L5.63964 2C4.68628 2 3.86545 2.67292 3.67848 3.60777L2.47848 9.60777C2.23097 10.8453 3.17755 12 4.43964 12H8.00004V16C8.00004 17.1046 8.89547 18 10 18C10.5523 18 11 17.5523 11 17V16.3333C11 15.4679 11.2807 14.6257 11.8 13.9333L13.2 12.0667C13.7193 11.3743 14 10.5321 14 9.66667Z" fill="#fff"/>
                        </svg>
                    </button>
                    <button type="button" class="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                      <svg width="20" height="20" stroke="currentColor" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2 10.5C2 9.67157 2.67157 9 3.5 9C4.32843 9 5 9.67157 5 10.5V16.5C5 17.3284 4.32843 18 3.5 18C2.67157 18 2 17.3284 2 16.5V10.5Z" fill="#fff"/>
                      <path d="M6 10.3333V15.7639C6 16.5215 6.428 17.214 7.10557 17.5528L7.15542 17.5777C7.71084 17.8554 8.32329 18 8.94427 18H14.3604C15.3138 18 16.1346 17.3271 16.3216 16.3922L17.5216 10.3922C17.7691 9.15465 16.8225 8 15.5604 8H12V4C12 2.89543 11.1046 2 10 2C9.44772 2 9 2.44772 9 3V3.66667C9 4.53215 8.71929 5.37428 8.2 6.06667L6.8 7.93333C6.28071 8.62572 6 9.46785 6 10.3333Z" fill="#fff"/>
                      </svg>

                    </button>
                </div>  
            </footer>
        </article>
      </div>
    </main>
  </div>
</div>

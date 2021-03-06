<!-- This example requires Tailwind CSS v2.0+ -->
<div class="modal opacity-0  pointer-events-none fixed z-10 inset-0 overflow-y-auto">
  <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
    <!--
      Background overlay, show/hide based on modal state.

      Entering: "ease-out duration-300"
        From: "opacity-0"
        To: "opacity-100"
      Leaving: "ease-in duration-200"
        From: "opacity-100"
        To: "opacity-0"
    -->
    <div class="fixed inset-0 transition-opacity" aria-hidden="true">
      <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
    </div>

    <!-- This element is to trick the browser into centering the modal contents. -->
    <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
    <!--
      Modal panel, show/hide based on modal state.

      Entering: "ease-out duration-300"
        From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        To: "opacity-100 translate-y-0 sm:scale-100"
      Leaving: "ease-in duration-200"
        From: "opacity-100 translate-y-0 sm:scale-100"
        To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
    -->
    <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full " role="dialog" aria-modal="true" aria-labelledby="modal-headline">
        <div class="text-xl p-3">
            <svg  class="w-6 h-6 inline-block"xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span class="p-2 pt-3">Izberi svojo sliko</span>
        </div>
        <div class="bg-gray-200 p-3">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">Naslov slike</label>
              <div class="mt-1">
                <input type="text" name="email" id="email" class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" placeholder="Naslov slike" aria-describedby="email-description">
              </div>
              <p class="mt-2 text-sm text-gray-500" id="email-description">
                Podaj naslov brez šumnikov zaradi PHP-ja
              </p>
            </div>
                <div class="max-w-md mx-auto rounded-lg overflow-hidden md:max-w-xl">
                    <div class="md:flex">
                        <div class="w-full pt-3 pb-3">
                            <div class="relative border-dotted h-48 rounded-lg border-dashed border-2 border-blue-700 bg-white hover:bg-gray-300 hover:border-gray-300 transition ease-out cursor-pointer flex justify-center items-center">
                                <div class="absolute">
                                    <div class="flex flex-col items-center">
                                      <svg class="text-blue-500 pb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                      </svg>
                                     <span class="block text-gray-400 font-normal">Izberi datoteko</span> </div>
                                </div> <input type="file" class="h-full w-full opacity-0" name="">
                            </div>
                        </div>
                    </div>
                </div>
        </div>
        <div class="bg-white p-3 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense text-center">
            <button type="button" class="w-full text-center inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500" ng-click="closeModal()">
              Prekliči
            </button>
            <button type="button" class="w-full text-center inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              Shrani podatke
            </button>
        </div>
    </div>
  </div>
</div>

<div class="system_message border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md absolute bottom-2 left-2" role="alert" style="display: none;">
  <div class="flex">
    <div class="py-1"><svg class="fill-current h-6 w-6 text-teal-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
    <div>
      <p class="font-bold">Sistemsko obvestil</p>
      <p class="text-sm sm_text"></p>
    </div>
  </div>
</div>
<h1 class="mx-auto text-white text-3xl text-center mt-20 pb-4 border-opacity-25 border-b-2 border-white w-1/2">
	Prijava v sistem     
</h1>
<div class="row mx-auto  w-5/6  m-10 bg-white rounded p-5" style="height: auto; min-height: 50vh;">
	<div class="mb-5">
	  <label for="email" class="block text-sm font-medium text-gray-500 text-xl">
	  	Uprabniško ime / e-naslov
	  </label>
	  <div class="mt-1">
	    <input type="text" name="email" id="email" class="p-2 w-full border-indigo-500 border-b-2 focus:border-indigo-700 focus:border-b-2 focus:outline-none" placeholder="Uproabniško ime / e-naslov" ng-model="login_username">
	  </div>
	</div>
	<div class="mb-5">
	  <label for="password" class="block text-sm font-medium text-gray-500 text-xl">
	  	Geslo
	  </label>
	  <div class="mt-1">
	    <input type="password" name="password" id="password" class="p-2 w-full border-indigo-500 border-b-2 focus:border-indigo-700 focus:border-b-2 focus:outline-none" placeholder="Geslo" ng-model="login_password">
	  </div>
	</div>
	<div class="grid grid-cols-2 gap-4">
	  <div>
			<div class="flex mt-6">
			  <label class="flex items-center pr-6">
			    <input type="checkbox" class="form-checkbox">
			    <span class="ml-2">Zapomni si me</span>
			  </label>
			</div>
	  </div>
	  <!-- ... -->
	  <div class="text-right pt-6">
	  	 <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
	  	 	Pozabil sem geslo
	  	 </button>
	  	 <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" ng-click="login()">
	  	 	Prijava
	  	 </button>
	  </div>
	</div>
</div>
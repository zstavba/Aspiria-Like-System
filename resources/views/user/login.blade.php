
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
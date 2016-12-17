var app = angular.module('app', []);
angular.module('app').config(['$controllerProvider', function($controllerProvider) {
  $controllerProvider.allowGlobals();
}]);

app.value('url', '/');

app.controller('appController', function($scope,$element,$http, url) {


		/*Объявляем переменные текущей даты */

		var date = new Date();
		var current_year = date.getFullYear();
		var current_month = date.getMonth()+1;
		var current_day = date.getDate();

		

	    


	    var rooms = [];
	    var tenants = [];
	    var rooms_by_days = [];
	    var array_of_days = [];
	    var all_rooms_type = [];
	    var array_of_rooms = [];
		var rooms_by_tenants = [];
	  	var room_for_errors = [];
		var edit_arr_for_errors = [];
	    var year = current_year;
		var month = current_month;
	  	var month_text = [
	  		'Январь',
	  		'Февраль',
	  		'Март',
	  		'Апрель',
	  		'Май',
	  		'Июнь',
	  		'Июль',
	  		'Август',
	  		'Сентябрь',
	  		'Октябрь',
	  		'Ноябрь',
	  		'Декабрь'
	  	];


	    createCalendar = function(selected_year, selected_month){

	    	rooms_by_days = [];
	    	array_of_days = [];
			rooms_by_tenants = [];	

		var days_in_month = 33 - new Date(selected_year, selected_month-1, 33).getDate();

		      	function create_array_rooms(data, day_from, day_to){


		        	var room = {
		        		number:data.number,
		        		tenant:[{
		        			name_id:data.tenant_id,
		        			day_from:day_from,
		        			day_to:day_to
		        			},
		        		]
		        	};

					rooms_by_tenants.push(room);
		      	};


	      	for (item in tenants){
		      		var date_from = tenants[item].date_from.split('-');
		      		var date_to = tenants[item].date_to.split('-');

		      		var month_from_compare = date_from[1];
		      		var month_to_compare = date_to[1];

		      		if (date_from[0] < selected_year){
						month_from_compare = -1;
		      		}

		      		if (date_to[0] > selected_year){
						month_to_compare = 13;
		      		}
		      		
		      		if (date_from[0] == selected_year || date_to[0] == selected_year || (date_from[0] <= selected_year && date_to[0] >= selected_year)){
		      			if (month_from_compare == selected_month || month_to_compare == selected_month || (month_from_compare <= selected_month && month_to_compare >= selected_month)){


		      				var day_from = date_from[2];
		      				var day_to = date_to[2];

		      				if (date_from[1] < selected_month){
		      					day_from = 1;
		      				}

		      				if (date_to[1] > selected_month){
		      					day_to = days_in_month;
		      				}

		      				if (date_from[0] < selected_year){
		      					day_from = 1;
		      				}

		      				if (date_to[0] > selected_year){
		      					day_to = days_in_month;
		      				}

				        	
				        	if (rooms_by_tenants.length == 0){
				        		create_array_rooms(tenants[item], day_from, day_to);
				        	}
				        	else{
				        		
				        		var found = false;
				        		
				        		rooms_by_tenants.forEach(function(elem,i,arr){
				        			if (elem.number == tenants[item].number){
				        				var name = {
				        					name_id:tenants[item].tenant_id,
						        			day_from:day_from,
						        			day_to:day_to
				        				};

				        				rooms_by_tenants[i].tenant.push(name);
				        				found = true;
				        			};
				        		});   

				        		if (found == false){
				        			create_array_rooms(tenants[item], day_from, day_to);
				        		};
				        	};


		      			}
		      		};
		      	}

		      	for (item in array_of_rooms){
		      		var found = false;
		      		
		      		for (room in rooms_by_tenants){	        	

		        		if (rooms_by_tenants[room].number == array_of_rooms[item].number){
	        				found = true;
		        		}

		        	}

		        	if (found == false){
			        	var number = {
			        		number:array_of_rooms[item].number,
			        		tenant:[{
			        			name_id:0,
			        			day_from:0,
			        			day_to:0
			        			},
			        		]
			        	};

						rooms_by_tenants.push(number);
		        	}
		        }

		      	for (number in rooms_by_tenants){
		        	
		        	var days = [];	
		        	
		        	for (var i = 1; i <= days_in_month; i++){
		        		var reserved ={
		        			reserved:false
		        		}

		        		days.push(reserved);
		        	};


		        	rooms_by_tenants[number].tenant.forEach(function(elem,i,arr){
		        		for (var i = 1; i <= days_in_month; i++){
		        			if ( i >= elem.day_from & i<= elem.day_to){
		        				if (days[i-1].reserved == true){
		        					var tenant_id_1 = days[i-1].tenant_id;
		        					var tenant_id_2 = elem.name_id;


		        					if (days[i-2].reserved == true){
		        						var tenant_id_2 = days[i-1].tenant_id;
		        						var tenant_id_1 = elem.name_id;
		        					};


		        					days[i-1] = {
		        						reserved:true,
		        						many:true,
		        						tenant_id_1:tenant_id_1,
		        						tenant_id_2:tenant_id_2,        						
		        					};
		        				}
		        				else{
		        					days[i-1] = {
		        						reserved:true,
		        						many:false,
		        						tenant_id:elem.name_id
		        					};
		        				};
		        			};
		        		};
		        	});

		        	var room = {
		        		number:rooms_by_tenants[number].number,
		        		days:days
		        	};
		        	rooms_by_days.push(room);
		        };	    	

			function SortByRooms(a, b) {
		  		if (Number(a.number) > Number(b.number)) return 1;
		  		if (Number(a.number) < Number(b.number)) return -1;
			}


				rooms_by_days.sort(SortByRooms);
				
				for (var i = 1; i <= days_in_month; i++){
					array_of_days.push(i);
				}
					
				array_of_days.unshift('');

			    $scope.rooms_by_days = rooms_by_days;
			    $scope.array_of_days = array_of_days;

	    }


	    getAllData = function(){
	    	var take_data= {
	      		method: 'GET',
	    	  	url:'/admin/take_data',
	    	};

	    	rooms = [];
	    	tenants = [];
	    	rooms_by_days = [];
	    	array_of_days = [];
	    	all_rooms_type = [];
	    	array_of_rooms = [];
			rooms_by_tenants = [];
	  		room_for_errors = [];
	  		year = current_year;
	  		month = current_month;

	  		$scope.month_send = month_text[month-1];
	  		$scope.year = year;

	    	$http(take_data)
		      .success(function(data) {

		      	/* Получаем по ajax 2 массива: номера и жильцы.
		      	1-й массив в json - номера. Второй соответственно - жильцы.
				
				array_of_rooms = [{number, stat, room_type},...]
				tenants = [{number, tenant, tenant_id, date_from, date to},...]
				*/

		      	array_of_rooms = data[0];
		      	tenants = data[1];
				all_rooms_type = data[2];
				firm = data[3];


		      	function roomSortByNumber(a, b) {
	  				if (Number(a.number) > Number(b.number)) return 1;
	  				if (Number(a.number) < Number(b.number)) return -1;
				}

				array_of_rooms.sort(roomSortByNumber);



		      	$scope.all_rooms_type = all_rooms_type;
		      	$scope.array_of_rooms = array_of_rooms;
		      	$scope.array_firm = firm;

		      	/* Их необходимо преобразовать в :
		      	
		      	rooms = [{number,stat,room_type,tenent_id},...]
		      	rooms_by_days = [{number,days:[{reserved, many, tenant_id},{reserved, many, tenant_id_1, tenent_id_2},...]},...]
		      	*/


	  /* массив дней, с первым пустым элементом для таблицы */
				

	  			for (item in tenants){
	  				if (room_for_errors.length == 0){
	  					var number = {
	  						number:tenants[item].number,
	  						date:[{
	  							date_from:tenants[item].date_from,
	  							date_to:tenants[item].date_to
	  						}]
	  					};
	  					
	  					room_for_errors.push(number);
	  				}
	  				else{

	  					var flag = 0;

	  					for (room_temp in room_for_errors){
	  						if (room_for_errors[room_temp].number == tenants[item].number){
	  							var date = {
	  							date_from:tenants[item].date_from,
	  							date_to:tenants[item].date_to
	  							}

	  							room_for_errors[room_temp].date.push(date);

	  							flag = 1;
	  						}
		  				}
		  				if (flag == 0){
			  				var number = {
			  					number:tenants[item].number,
			  					date:[{
			  						date_from:tenants[item].date_from,
			  						date_to:tenants[item].date_to
			  					}]
			  				};
			  					
			  				room_for_errors.push(number);	  							
	  					}
	  					
	  				}
	  			}
		      	
		      	for (item in room_for_errors){
		      		function SortByDateFrom(a, b) {
	  					if (a.date_from > b.date_from) return 1;
	  					if (a.date_from < b.date_from) return -1;
					}

					room_for_errors[item].date.sort(SortByDateFrom);
		      	}
		      	
				$scope.room_for_errors = room_for_errors;




				createCalendar(current_year, current_month);
	

		       	/* Сортируем список жильцов по имени */

				function SortByTenants(a, b) {
			  		if (a.tenant > b.tenant) return 1;
			  		if (a.tenant < b.tenant) return -1;
				}
			 			
				tenants.sort(SortByTenants);
				$scope.tenants = tenants;




			    /* Номера */


				for (item in array_of_rooms){
					if (array_of_rooms[item].stat =='avaible'){

			  			for(element in rooms_by_days){

			  				if (array_of_rooms[item].number == rooms_by_days[element].number ){

								if (rooms_by_days[element].days[current_day-1].reserved == true){
				      				var tenant_id = rooms_by_days[element].days[current_day-1].tenant_id;
				      				var tenant_id_1 = rooms_by_days[element].days[current_day-1].tenant_id_1;
				   					var tenant_id_2 = rooms_by_days[element].days[current_day-1].tenant_id_2;

				   					if(tenant_id != undefined){
					      				var tenant_surname = '';
					      				var tenant_to = '';
					      				var tenant_from = '';
					      				var tenant_firm = '';

					      				for (tenant in tenants){
					      					if (tenants[tenant].tenant_id == tenant_id){
							      				tenant_surname = tenants[tenant].tenant;
							      				tenant_from = tenants[tenant].date_from;
							      				tenant_to = tenants[tenant].date_to;
							      				tenant_firm = tenants[tenant].firm;				      						
					      					}
					      				}

					      				var room ={
					      					number:array_of_rooms[item].number,
					      					stat:'reserved',
				      						room_type:array_of_rooms[item].room_type,
				      						two_tenants:false,
				      						surname:tenant_surname,
				      						from:tenant_from,
				      						to:tenant_to,
				      						firm:tenant_firm		      			
					      				} 				   						
				   					}

				   					if(tenant_id_1 != undefined){
					      				var tenant_1_surname = '';
					      				var tenant_1_firm = '';
					      				var tenant_2_surname = '';
					      				var tenant_2_firm = '';

					 					for (tenant in tenants){
					      					if (tenants[tenant].tenant_id == tenant_id_1){
							      				tenant_1_surname = tenants[tenant].tenant;
							      				tenant_1_firm = tenants[tenant].firm;				      						
					      					}
					      					if (tenants[tenant].tenant_id == tenant_id_2){
							      				tenant_2_surname = tenants[tenant].tenant;
							      				tenant_2_firm = tenants[tenant].firm;				      						
					      					}
					      				}

					      				var room ={
					      					number:array_of_rooms[item].number,
					      					stat:'reserved',
				      						room_type:array_of_rooms[item].room_type,
				      						two_tenants:true,
				      						surname_1:tenant_1_surname,
				      						firm_1:tenant_1_firm,
				      						surname_2:tenant_2_surname,
				      						firm_2:tenant_2_firm		      			
					      				} 
				   					}
							
								}
								else{
			      					var room ={
			      						number:array_of_rooms[item].number,
			      						stat:'free',
			      						room_type:array_of_rooms[item].room_type	      			
			      					} 
		      					}
			  				}
			  			}
		      		}

		      		if (array_of_rooms[item].stat =='disable'){
			      		var room ={
			      			number:array_of_rooms[item].number,
			      			stat:array_of_rooms[item].stat,
			      			room_type:array_of_rooms[item].room_type		      			
			      		} 
		      		}
			        
			        rooms.push(room);
				}

				function sortRooms(a, b) {
		  			if (Number(a.number) > Number(b.number)) return 1;
		  			if (Number(a.number) < Number(b.number)) return -1;
				}

				rooms.sort(sortRooms);

				$scope.rooms = rooms;
			});
	    }


	    	



	    getAllData();



	      	/* Сортировка списка жильцов при клике по имени */

			$scope.SortTenantsByName = function(data){
		        
		        function compareNumeric(a, b) {
	  				if (a.tenant > b.tenant) return 1;
	  				if (a.tenant < b.tenant) return -1;
				}
	 			
 				$scope.tenant_sort = 1;

				tenants.sort(compareNumeric);
				$scope.tenants = tenants;

			}

	      	/* Сортировка списка жильцов при клике по комнатам */

			$scope.SortTenantsByRoom = function(data){
		        
		        function compareNumeric(a, b) {
	  				if (Number(a.number) > Number(b.number)) return 1;
	  				if (Number(a.number) < Number(b.number)) return -1;
				}
	 			
 				$scope.tenant_sort = 2;

				tenants.sort(compareNumeric);
				$scope.tenants = tenants;

			}

	      	/* Сортировка списка жильцов при клике по дате приезда */

			$scope.SortTenantsByDateFrom = function(data){
		        
		        function compareNumeric(a, b) {
	  				if (a.date_from > b.date_from) return 1;
	  				if (a.date_from < b.date_from) return -1;
				}
	 			
 				$scope.tenant_sort = 3;

				tenants.sort(compareNumeric);
				$scope.tenants = tenants;

			}

	      	/* Сортировка списка жильцов при клике по дате отъезда */
			
			$scope.SortTenantsByDateTo = function(data){
		        
		        function compareNumeric(a, b) {
	  				if (a.date_to > b.date_to) return 1;
	  				if (a.date_to < b.date_to) return -1;
				}
	 			
 				$scope.tenant_sort = 4;

				tenants.sort(compareNumeric);
				$scope.tenants = tenants;

			}

			$scope.SortTenantsByFirm = function(data){
		        
		        function compareNumeric(a, b) {
	  				if (a.firm > b.firm) return 1;
	  				if (a.firm < b.firm) return -1;
				}
	 			
 				$scope.tenant_sort = 5;

				tenants.sort(compareNumeric);
				$scope.tenants = tenants;

			}

			    $scope.CreateTenant = function() {
			        if ($scope.text) {
			          $scope.text = 'good';
			        }
			    };

	    $scope.Click = function(number){
		 	var room = document.getElementById("room_"+number);
		 	var all_rooms = document.getElementsByClassName("room"); 
		 	var room_menu = room.getElementsByClassName("menu")[0];

		 	for (item in all_rooms) {
		 		if (item != room){

		 		}

		 	}
		 	room.classList.toggle("room_click");
		 	room_menu.classList.toggle("openMenu");
	    };

	    $scope.openPopup = function(option, room_number, surname, first_name, second_name, date_birthday, pass, firm, date_from, date_to, tenant_id){
	    	if (option == 'new'){
	    		$scope.select = 1;
		    	document.getElementById('room_number').value = '';
		    	document.getElementById('room_type').value = '';
		    	document.getElementById('room_stat').value = '';		    		    		
	    	}

	    	if (option == 'edit'){
	    		$scope.select = 2;
	    		var edit_room_stat = '';
	    		var edit_room_type = '';
	    		var room_type_id = '';

	    		for (item in array_of_rooms){
	    			if (array_of_rooms[item].number == room_number){
	    				room_type = array_of_rooms[item].room_type;

	    				if (array_of_rooms[item].stat == 'disable'){
	    					room_stat = 'Не работает';
	    				}
	    				else{
	    					room_stat = 'Работает';
	    				}
	    				
	    			}
	    		}

	    		for (item in all_rooms_type){
	    			if (room_type == all_rooms_type[item].name){
	    				room_type_id = all_rooms_type[item].id;
	    			}
	    		}

	    		$scope.send_edit_room.edit_number.$viewValue = room_number;
	    		$scope.send_edit_room.edit_type.$viewValue = room_type_id;
	    		$scope.send_edit_room.stat.$viewValue = room_stat;
	    		
		    	document.getElementById('edit_room_number').value = room_number;	    		
		    	document.getElementById('edit_room_type').value = room_type_id;
		    	document.getElementById('edit_room_stat').value = room_stat;
	    	}

	    	if(option == 'new_tenant'){
	    		$scope.select = 3;	
		    	document.getElementById('surname').value = '';
		    	document.getElementById('first_name').value = '';
		    	document.getElementById('second_name').value = ''; 
		    	document.getElementById('date_birthday').value = '';
		    	document.getElementById('pass_data').value = '';
		    	document.getElementById('firm').value = ''; 
		    	document.getElementById('room').value = '';
		    	document.getElementById('date_from').value = '';
		    	document.getElementById('date_to').value = ''; 	
	    	}

	    	if(option == 'edit_tenant'){

	    		$scope.edit_date_valid = 0;

	    		edit_arr_for_errors = [];

	    		for (item in room_for_errors){

	    			var arr_number = {
	    				number:room_for_errors[item].number,
	    				date:room_for_errors[item].date.slice(0)
	    			}

	    			edit_arr_for_errors.push(arr_number);
	    		}
	    		

	    		for(item in edit_arr_for_errors){
	    			if(room_number == edit_arr_for_errors[item].number){
	    				for(date in edit_arr_for_errors[item].date){
	    					if(date_from == edit_arr_for_errors[item].date[date].date_from){
	    						edit_arr_for_errors[item].date.splice(date,1);
	    					}
	    				}
	    			}
	    		}
	    		$scope.edit_arr_for_errors = edit_arr_for_errors;

	    		$scope.select = 4;	
	    		$scope.edit_send_tenant.edit_surname.$viewValue = surname;
	    		$scope.edit_send_tenant.edit_first_name.$viewValue = first_name;
	    		$scope.edit_send_tenant.edit_second_name.$viewValue = second_name;
	    		$scope.edit_send_tenant.edit_date_birthday.$viewValue = date_birthday;
	    		$scope.edit_send_tenant.edit_pass_data.$viewValue = pass;
	    		$scope.edit_send_tenant.edit_firm.$viewValue = firm;
	    		$scope.edit_send_tenant.edit_room.$viewValue = room_number;
	    		$scope.edit_send_tenant.edit_date_from.$viewValue = date_from;
	    		$scope.edit_send_tenant.edit_date_to.$viewValue = date_to;
	    		$scope.edit_send_tenant.edit_id.$viewValue = tenant_id;

		    	document.getElementById('edit_surname').value = surname;
		    	document.getElementById('edit_first_name').value = first_name;
		    	document.getElementById('edit_second_name').value = second_name;
		    	document.getElementById('edit_date_birthday').value = date_birthday;
		    	document.getElementById('edit_pass_data').value = pass;
		    	document.getElementById('edit_firm').value = firm; 
		    	document.getElementById('edit_room').value = room_number;
		    	document.getElementById('edit_date_from').value = date_from;
		    	document.getElementById('edit_date_to').value = date_to; 
		    	document.getElementById('edit_id').value = tenant_id;    		
	    	}

	    	if (option == 'delete_number'){
	    		$scope.select = 5;
	    		$scope.number_for_del = room_number; 
	    	}

	    	if (option == 'delete_tenant'){
	    		$scope.select = 6;
	    		$scope.tenant_for_del = room_number;
	    		$scope.surname_for_del = surname;  
	    	}

	    	$('#hide-layout, #popup').fadeIn(300);  // плавно показываем окно/фон

  			$('#popup').animate({top:'22%'});
  			$('#blur').css({
				"-webkit-filter": "blur(5px)",
				"-moz-filter": "blur(5px)",
				"-o-filter": "blur(5px)",
				"-ms-filter": "blur(5px)",
				"filter": "blur(5px)"
			});
	    };

	   	$scope.closePopup = function(){
			$('#popup').animate({top:'-100%'});
	  		$('#hide-layout,#popup').fadeOut(300); // плавно скрываем окно/фон
	  		$('#blur').css({
					"-webkit-filter": "blur(0px)",
					"-moz-filter": "blur(0px)",
					"-o-filter": "blur(0px)",
					"-ms-filter": "blur(0px)",
					"filter": "blur(0px)"
			});
	   	}

		$scope.range = function(min, max, step) {
		    step = step || 1;
		    var input = [];
		    for (var i = min; i <= max; i += step) {
		        input.push(i);
		    }
		    return input;
		};


	    $scope.Create_number = function(){

	    	var take_data= {
	      		method: 'GET',
	      		url:'/admin/manage_number',
	      		params:{
	      			'option':1,
	      			'number':$scope.send_room.number.$viewValue,
	      			'type':$scope.send_room.type.$viewValue,
	      			'stat':	$scope.send_room.stat.$viewValue
	      		}
	    	};

	    	$http(take_data)
	      		.success(function(data) {
	      			alert(data.room);
	      			$scope.test = data.stat;
			      	getAllData();
			      	$scope.closePopup();
			})

	    };

	    $scope.Edit_number = function(){
	    	var take_data= {
	      		method: 'GET',
	      		url:'/admin/manage_number',
	      		params:{
	      			'option':2,
	      			'number':$scope.send_edit_room.edit_number.$modelValue,
	      			'type':$scope.send_edit_room.edit_type.$viewValue,
	      			'stat':	$scope.send_edit_room.stat.$viewValue
	      		}
	    	};

	    	$http(take_data)
	      		.success(function(data) {
	      			alert(data.room);
	      			$scope.test = data.stat;
			      	getAllData();
			      	$scope.closePopup();
			})	    	
	    };

	    $scope.delete_number = function(room){
	    	var take_data= {
	      		method: 'GET',
	      		url:'/admin/manage_number',
	      		params:{
	      			'option':3,
	      			'number':room
	      		}
	    	};

	    	$http(take_data)
	      		.success(function(data) {
	      			alert(data.room);
	      			$scope.test = data.stat;
	      			getAllData(); 
	      			$scope.closePopup();
			})	
	    }

	    $scope.CreateTenant = function(){

	    	var take_data= {
	      		method: 'GET',
	      		url:'/admin/manage_tenant',
	      		params:{
	      			'option':1,
	      			'surname': $scope.send_tenant.surname.$viewValue,
	      			'first_name': $scope.send_tenant.first_name.$viewValue,
	      			'second_name': $scope.send_tenant.second_name.$viewValue,
	      			'date_birthday': $scope.send_tenant.date_birthday.$viewValue,
	      			'pass_data': $scope.send_tenant.pass_data.$viewValue,
	      			'number': $scope.send_tenant.room.$viewValue,
	      			'firm':	$scope.send_tenant.firm.$viewValue,
	      			'date_from': $scope.send_tenant.date_from.$viewValue,
	      			'date_to': $scope.send_tenant.date_to.$viewValue,
	      		}
	    	};

	    	$http(take_data)
	      		.success(function(data) {
	      			alert(data.status);
	      			$scope.test = data.stat;
			      	getAllData();
			      	$scope.closePopup();
			})

	    };

	    $scope.EditTenant = function(){

	    	var take_data= {
	      		method: 'GET',
	      		url:'/admin/manage_tenant',
	      		params:{
	      			'option':2,
	      			'surname': $scope.edit_send_tenant.edit_surname.$viewValue,
	      			'first_name': $scope.edit_send_tenant.edit_first_name.$viewValue,
	      			'second_name': $scope.edit_send_tenant.edit_second_name.$viewValue,
	      			'date_birthday': $scope.edit_send_tenant.edit_date_birthday.$viewValue,
	      			'pass_data': $scope.edit_send_tenant.edit_pass_data.$viewValue,
	      			'number': $scope.edit_send_tenant.edit_room.$viewValue,
	      			'firm':	$scope.edit_send_tenant.edit_firm.$viewValue,
	      			'date_from': $scope.edit_send_tenant.edit_date_from.$viewValue,
	      			'date_to': $scope.edit_send_tenant.edit_date_to.$viewValue,
	      			'id': $scope.edit_send_tenant.edit_id.$viewValue,
	      		}
	    	};

	    	$http(take_data)
	      		.success(function(data) {
	      			alert(data.status);
	      			$scope.test = data.stat;
			      	getAllData();
			      	$scope.closePopup();
			})

	    };

	    $scope.delete_tenant = function(tenant){
	    	var take_data= {
	      		method: 'GET',
	      		url:'/admin/manage_tenant',
	      		params:{
	      			'option':3,
	      			'tenant':tenant
	      		}
	    	};

	    	$http(take_data)
	      		.success(function(data) {
	      			alert(data.status);
	      			$scope.test = data.stat;
	      			getAllData();
	      			$scope.closePopup(); 
			})	
	    }

	    $scope.MonthDown = function(){
	    	if (month == 1){
	    		month = 12;
	    		year = year - 1;
	    	}
	    	else{
	    		month = month - 1;	    		
	    	}
	  		
	  		$scope.month_send = month_text[month-1];
	    	$scope.month = month;
	    	$scope.year = year;

	    	createCalendar(year, month);
	    }

	   	$scope.MonthUp = function(){
	    	if (month == 12){
	    		month = 1;
	    		year = year + 1;
	    	}
	    	else{
	    		month = month + 1;	    		
	    	}
	  		
	  		$scope.month_send = month_text[month-1];
	    	$scope.month = month;
	    	$scope.year = year;

	    	createCalendar(year, month);
	    }

});

app.directive('tnDirective', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attr, mCtrl) {
            function tnValidation(value) {

            	var validate = true;
            	var room = scope.send_tenant.room.$viewValue;
            	var date_from = scope.send_tenant.date_from.$viewValue;
            	var date_to = scope.send_tenant.date_to.$viewValue
            	var date_arr = [];

            	if (date_from>=date_to){
					scope.date_valid = 1;
            	}
            	else{
					scope.date_valid = 0;            		
            	}

            	if (room != '' && date_from != '' && date_to != '' && scope.date_valid != 1){
            		for (item in scope.room_for_errors){
            			if (room == scope.room_for_errors[item].number){
            				date_arr = scope.room_for_errors[item].date;
            			}
            		}

            		scope.date_valid = 2;
            		if (date_arr.length == 0 ){
            			scope.date_valid = 0;            			
            		}else{
	            		if (date_to <= date_arr[0].date_from ){
	            			scope.date_valid = 0;
	            		}
	            		if (date_from >= date_arr[date_arr.length - 1].date_to){
	            			scope.date_valid = 0;
	            		}
	            	}

            		if (scope.date_valid == 2){

            			for (item in date_arr){
            				if (date_from >= date_arr[item].date_from){
            					if (date_from < date_arr[item].date_to){
            						break;
            					}
            				}else{
            					if(date_to <= date_arr[item].date_from){
									scope.date_valid = 0;
									break;
            					}else{
            						break;
            					}
            				}
            			}
            		}
            	}

				mCtrl.$setValidity('room', validate);
				return value;
            }
            mCtrl.$parsers.push(tnValidation);
        }
    };
});

app.directive('tneditDirective', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attr, mCtrl) {
            function tnValidation(value) {

            	var validate = true;
            	var room = scope.edit_send_tenant.edit_room.$viewValue;
            	var edit_date_from = scope.edit_send_tenant.edit_date_from.$viewValue;
            	var edit_date_to = scope.edit_send_tenant.edit_date_to.$viewValue;
            	var date_arr = [];

            	if (edit_date_from>=edit_date_to){
					scope.edit_date_valid = 1;
            	}
            	else{
					scope.edit_date_valid = 0;            		
            	}

            	if (room != '' && edit_date_from != '' && edit_date_to != '' && scope.edit_date_valid != 1){
            		for (item in scope.edit_arr_for_errors){
            			if (room == scope.edit_arr_for_errors[item].number){
            				date_arr = scope.edit_arr_for_errors[item].date;
            			}
            		}

            		scope.edit_date_valid = 2;
            		if (date_arr.length == 0 ){
            			scope.edit_date_valid = 0;            			
            		}else{
	            		if (edit_date_to <= date_arr[0].date_from ){
	            			scope.edit_date_valid = 0;
	            		}
	            		if (edit_date_from >= date_arr[date_arr.length - 1].date_to){
	            			scope.edit_date_valid = 0;
	            		}
	            	}

            		if (scope.edit_date_valid == 2){

            			for (item in date_arr){
            				if (edit_date_from >= date_arr[item].date_from){
            					if (edit_date_from < date_arr[item].date_to){
            						break;
            					}
            				}else{
            					if(edit_date_to <= date_arr[item].date_from){
									scope.edit_date_valid = 0;
									break;
            					}else{
            						break;
            					}
            				}
            			}
            		}
            	}


				mCtrl.$setValidity('room', validate);
				return value;
            }
            mCtrl.$parsers.push(tnValidation);
        }
    };
});

app.directive('myDirective', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attr, mCtrl) {
            function myValidation(value) {

            	var validate = true;

            	for (item in scope.array_of_rooms){
            		if (value == scope.array_of_rooms[item].number){
            			validate = false;
            		}
            	}

				mCtrl.$setValidity('number', validate);

                return value;
            }
            mCtrl.$parsers.push(myValidation);
        }
    };
});

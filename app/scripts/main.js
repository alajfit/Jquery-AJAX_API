console.log('\'Allo \'Allo!');

$(document).ready(function(){
	'use strict';
	// cache DOM elements
	var $orders = $('#orders');
	var $newName = $('#name');
	var $newDrink = $('#drink');

	var orderTemplate = $('#order-template').html();

	function addOrder(order) {
		// Pass Mustache a Template and an Object
		$orders.append(Mustache.render(orderTemplate, order));
	}

	$.ajax({
		type: 'GET',
		url: '/api/orders.json',
		success: function(orders) {
			// we grab each element of the array
			// Pass the array and a function call
			// We then pass I as index and order as item
			$.each(orders, function(i, order) {
				addOrder(order);
			});
		},
		error: function() {
			alert('Error loading errors');
		}
	});

	$('#add-order').on('click', function() {
		var order = {
			name: $newName.val(),
			drink: $newDrink.val()
		};

		$.ajax({
			type: 'POST',
			url: '/api/orders.json',
			data: order,
			success: function(newOrder) {
				addOrder(newOrder);
			},
			error: function() {
				alert('Error Posting!');
			}
		});
	});

	$orders.delegate('.remove', 'click', function() {
		// creating a link to closest li
		var $li = $(this).closest('li');
		$.ajax({
			type: 'DELETE',
			url: '/api/orders/' + $(this).attr('data-id'),
			success: function() {
				$li.fadeOut(300, function(){
					$(this).remove();
				});
				console.log('Removed');
			},
			error: function() {
				alert("Didnt Work");
			}
		});
	});

	$orders.delegate('.editOrder', 'click', function() {
		var $li = $(this).closest('li');
		$li.find('input.name').val( $li.find('span.name').html() );
		$li.find('input.drink').val( $li.find('span.drink').html() );
		$li.addClass('edit');
	});

	$orders.delegate('.cancelEdit', 'click', function() {
		$(this).closest('li').removeClass('edit');
	});

	$orders.delegate('.saveEdit', 'click', function() {
		var $li = $(this).closest('li');
		var order = {
			name: $li.find('input.name').val(),
			drink: $li.find('input.drink').val()
		};

		// this should be got from actual requests
		var $num = 1;
		$.ajax({
			type: 'PUT',
			url: '/api/orders/' + $num,
			data: order,
			success: function() {
				$li.find('span.name').html(order.name);
				$li.find('span.drink').html(order.drink);
				$li.removeClass('edit');
			},
			error: function() {
				alert('Error updating order');
			}
		})


	});
});
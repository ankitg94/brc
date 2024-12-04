/*var broker_option='';
for (i = 20; i >= 0; i--) {
	broker_option +='<option value="'+i+'">'+i+'</option>';
}
$('#select_brokerage').html(broker_option)*/

function click_txt(num)
{
	var b = $("#click_txt"+num+"");
	var w = $("#total_brokerage"+num+"");
	var l = $(".all_text");
	var f = $("#fa_icon"+num+"");
	if(w.hasClass('open')) {
		w.removeClass('open');
		w.addClass('hide');
		w.height(0);
    	b.text('View Charges Breakup');
    	f.removeClass('fa-chevron-circle-up');
		f.addClass('fa-chevron-circle-down');
    } else {
		w.removeClass('hide');
		w.addClass('open');
		w.height(l.outerHeight(true));
		b.text('Hide Charges Breakup');
		f.removeClass('fa-chevron-circle-down');
		f.addClass('fa-chevron-circle-up');
    }
}
function search_company_byword(num)
{
	var json_data = "";
	const searchWrapper = document.querySelector('#search-input'+num+'');
	const inputBox = searchWrapper.querySelector('input');
	inputBox.onkeyup = (e) => {
		let search_company = $('#search_company'+num+'').val();
		if (search_company == '') {
        	$('#autocom-box'+num+'').removeClass('show');
		}
		else if(search_company.length < 3)
		{
			$('#autocom-box'+num+'').removeClass('show');
		}
		else {
			$.ajax({
				crossOrigin: true,
				type: 'POST',
				contentType: 'application/json; charset=utf-8',
				url: 'https://www.sharewealthindia.com/sharewealth_trading_api/CompanyInformation/getcompany/'+search_company,
				data: JSON.stringify(json_data),
				success: function(data) {
					if(data['data'].length==0)
					{
						$('#autocom-box'+num+'').removeClass('show');
					}
					else
					{
						$('#autocom-box'+num+'').addClass('show');
						var suggestions = '';
						for (i = 0; i < data['data'].length; i++) {
							suggestions += '<li class="companylist" onclick="seleted_company(\''+ data['data'][i][1] +'\',\''+ data['data'][i][0] +'\',\''+num+'\')"> <span>' + data['data'][i][1] + ' </span> </li>';
						}
						$('#autocom-box'+num+'').replaceWith('<div class="autocom-box show" id="autocom-box'+num+'"><div class="autocom-box_div">' + suggestions + ' </div></div>');
						$('#autocom-box'+num+'').removeHighlight().highlight(search_company);
					}
				},
				error: function(error) {
					alert('Something went wrong');
				},
				dataType: 'json',
			});
		}
	}
}

function select_segment(a,num,e)
{
	var i, tablinks;
	tablinks = document.getElementsByClassName("tab_links"+num+"");
	for (i = 0; i < tablinks.length; i++) {
		tablinks[i].className = "tab_links"+num+" non_active";
	}
	$(e).addClass('active');
    $(e).removeClass('non_active');
}
function seleted_company(a,b,num)
{
	$('#autocom-box'+num+'').removeClass('show');
	$('#search_company'+num+'').val(a)
	var json_data='';
	$.ajax({
        crossOrigin: true,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "https://www.sharewealthindia.com/sharewealth_trading_api/CompanyInformation/GetSharePriceDetails/" +b,
        data: JSON.stringify(json_data),
        success: function(data) {
            
            var quantity=$('#quantity'+num+'').val();
			if($('#select_check').val()=='intraday')
			{	
	            $('#buy_price'+num+'').val(parseFloat(data['data'][0][5]).toFixed(0));
	            var buy_price=parseFloat($('#buy_price'+num+'').val());
	            var percentToGet=(5 / 100) * buy_price;
	            var sell_price=buy_price + percentToGet;
	            $('#sell_price'+num+'').val(parseFloat(sell_price).toFixed(0));

	            var total_sell_price = quantity * (buy_price + percentToGet);
	            $('#net_buy_value'+num+'').text(parseFloat(quantity * data['data'][0][5]).toFixed(0));
				$('#net_sell_value'+num+'').text(parseFloat(total_sell_price).toFixed(0));

				var brokerage=(0.02 / 100)*(total_sell_price + (quantity*buy_price));
				$('#brokerage'+num+'').text(parseFloat(brokerage).toFixed(0));
				$('#brokerage_1'+num+'').text(parseFloat(brokerage).toFixed(0));

				

				var stt_ctt=(0.025 / 100) * total_sell_price;
				$('#stt_ctt'+num+'').text(parseFloat(stt_ctt).toFixed(0));

				var t_charges_sel=(0.00345 / 100) * total_sell_price;
				var t_charges_buy=(0.00345 / 100) * (quantity*buy_price);
				var t_charges=t_charges_sel+t_charges_buy;
				$('#t_charges'+num+'').text(parseFloat(t_charges).toFixed(0));

				var gst=(18 / 100) * (brokerage+t_charges)
				$('#gst'+num+'').text(parseFloat(gst).toFixed(0));

				var stamp=(0.003 / 100) * (quantity*buy_price);
				$('#stamp'+num+'').text(parseFloat(stamp).toFixed(0));

				var sebi_fee=(total_sell_price + (quantity*buy_price))*(10/10000000);
				$('#sebi_fee'+num+'').text(parseFloat(sebi_fee).toFixed(0));

				var othertaxes=sebi_fee+stamp+gst+t_charges+stt_ctt;
				$('#othertaxes'+num+'').text(parseFloat(othertaxes).toFixed(0));

				var total_tax=brokerage + othertaxes;
				$('#total_tax'+num+'').text(parseFloat(total_tax).toFixed(0));

				var breakeven=(((quantity*buy_price)+total_tax)/quantity)-buy_price;
				$('#breakeven'+num+'').text(parseFloat(breakeven).toFixed(0));
				$('#breakeven_1'+num+'').text(parseFloat(breakeven).toFixed(0));

				var pnl=total_sell_price - (quantity*buy_price) - total_tax;
				$('#pnl'+num+'').text(parseFloat(pnl).toFixed(0));	

				var total_sum_brokerage=0;
				var total_sum_tax=0;
				var total_pnl=0;
				var other_charges=0;
				var total_breakeven=0;
				var total_stt_ctt=0;
				var total_t_charges=0;
				var total_gst=0;
				var total_stamp=0;
				var total_sebi_fee=0;
				var total_net_buy_value=0;
				var total_net_sell_value=0;
				var total_order='';
				for (var i = 1; i <= $('#total_order_per').val(); i++) {
					total_sum_brokerage =total_sum_brokerage + parseFloat($('#brokerage'+i+'').text());
					total_sum_tax=total_sum_tax+parseFloat($('#total_tax'+i+'').text());
					total_pnl=total_pnl+parseFloat($('#pnl'+i+'').text());
					other_charges=other_charges+parseFloat($('#othertaxes'+i+'').text());
					total_breakeven=total_breakeven+parseFloat($('#breakeven'+i+'').text());
					total_stt_ctt=total_stt_ctt+parseFloat($('#stt_ctt'+i+'').text());
					total_t_charges=total_t_charges+parseFloat($('#t_charges'+i+'').text());
					total_gst=total_gst+parseFloat($('#gst'+i+'').text());
					total_stamp=total_stamp+parseFloat($('#stamp'+i+'').text());
					total_sebi_fee=total_sebi_fee+parseFloat($('#sebi_fee'+i+'').text());
					total_net_buy_value=total_net_buy_value+parseFloat($('#net_buy_value'+i+'').text());
					total_net_sell_value=total_net_sell_value+parseFloat($('#net_sell_value'+i+'').text());
					if($('#search_company'+i+'').val()!='')
					{
						total_order +='<tr><td>'+ $('#search_company'+i+'').val() +'</td><td>'+ $('#quantity'+i+'').val() +'</td><td>'+ $('#buy_price'+i+'').val() +'</td><td>'+ $('#sell_price'+i+'').val() +'</td><td>'+$('#delivery'+i+'').val()+'</td></tr>';
					}
				}
				$('#FooterBrokerage').text(parseFloat(total_sum_brokerage).toFixed(0));
				$('#brokerage').text(parseFloat(total_sum_brokerage).toFixed(0));
				$('#brokerage_1').text(parseFloat(total_sum_brokerage).toFixed(0));
				$('#FooterBrokerageTaxes').text(parseFloat(total_sum_tax).toFixed(0));
				$('#total_tax').text(parseFloat(total_sum_tax).toFixed(0));
				$('#FooterPnl').text(parseFloat(total_pnl).toFixed(0));
				$('#pnl').text(parseFloat(total_pnl).toFixed(0));
				$('#othertaxes').text(parseFloat(other_charges).toFixed(0));
				$('#breakeven').text(parseFloat(total_breakeven).toFixed(0));
				$('#breakeven_1').text(parseFloat(total_breakeven).toFixed(0));
				$('#stt_ctt').text(parseFloat(total_stt_ctt).toFixed(0));
				$('#t_charges').text(parseFloat(total_t_charges).toFixed(0));
				$('#gst').text(parseFloat(total_gst).toFixed(0));
				$('#stamp').text(parseFloat(total_stamp).toFixed(0));
				$('#sebi_fee').text(parseFloat(total_sebi_fee).toFixed(0));
				$('#total_order').replaceWith('<tbody id="total_order">'+total_order+'</tbody>');
				$('#net_buy_value').text('â‚¹ '+parseFloat(total_net_buy_value).toFixed(0));
				$('#net_sell_value').text('â‚¹ '+parseFloat(total_net_sell_value).toFixed(0));
			}
			else
			{
				$('#buy_price'+num+'').val(parseFloat(data['data'][0][5]).toFixed(0));
	            var buy_price=parseFloat($('#buy_price'+num+'').val());
	            var percentToGet=(5 / 100) * buy_price;
	            var sell_price=buy_price + percentToGet;
	            $('#sell_price'+num+'').val(parseFloat(sell_price).toFixed(0));

	            var total_sell_price = quantity * (buy_price + percentToGet);
	            $('#net_buy_value'+num+'').text(parseFloat(quantity * data['data'][0][5]).toFixed(0));
				$('#net_sell_value'+num+'').text(parseFloat(total_sell_price).toFixed(0));

				var brokerage=(0.2 / 100)*(total_sell_price + (quantity*buy_price));
				$('#brokerage'+num+'').text(parseFloat(brokerage).toFixed(0));
				$('#brokerage_1'+num+'').text(parseFloat(brokerage).toFixed(0));

				

				var stt_ctt=(0.1 / 100) * (total_sell_price + (quantity*buy_price));
				$('#stt_ctt'+num+'').text(parseFloat(stt_ctt).toFixed(0));

				var t_charges_sel=(0.00345 / 100) * total_sell_price;
				var t_charges_buy=(0.00345 / 100) * (quantity*buy_price);
				var t_charges=t_charges_sel+t_charges_buy;
				$('#t_charges'+num+'').text(parseFloat(t_charges).toFixed(0));

				var gst=(18 / 100) * (brokerage+t_charges)
				$('#gst'+num+'').text(parseFloat(gst).toFixed(0));

				var stamp=(0.015 / 100) * (quantity*buy_price);
				$('#stamp'+num+'').text(parseFloat(stamp).toFixed(0));

				var sebi_fee=(total_sell_price + (quantity*buy_price))*(10/10000000);
				$('#sebi_fee'+num+'').text(parseFloat(sebi_fee).toFixed(0));

				var othertaxes=sebi_fee+stamp+gst+t_charges+stt_ctt;
				$('#othertaxes'+num+'').text(parseFloat(othertaxes).toFixed(0));

				var total_tax=brokerage + othertaxes;
				$('#total_tax'+num+'').text(parseFloat(total_tax).toFixed(0));

				var breakeven=(((quantity*buy_price)+total_tax)/quantity)-buy_price;
				$('#breakeven'+num+'').text(parseFloat(breakeven).toFixed(0));
				$('#breakeven_1'+num+'').text(parseFloat(breakeven).toFixed(0));

				var pnl=total_sell_price - (quantity*buy_price) - total_tax;
				$('#pnl'+num+'').text(parseFloat(pnl).toFixed(0));

				var total_sum_brokerage=0;
				var total_sum_tax=0;
				var total_pnl=0;
				var other_charges=0;
				var total_breakeven=0;
				var total_stt_ctt=0;
				var total_t_charges=0;
				var total_gst=0;
				var total_stamp=0;
				var total_sebi_fee=0;
				var total_net_buy_value=0;
				var total_net_sell_value=0;
				var total_order='';
				for (var i = 1; i <= $('#total_order_per').val(); i++) {
					total_sum_brokerage =total_sum_brokerage + parseFloat($('#brokerage'+i+'').text());
					total_sum_tax=total_sum_tax+parseFloat($('#total_tax'+i+'').text());
					total_pnl=total_pnl+parseFloat($('#pnl'+i+'').text());
					other_charges=other_charges+parseFloat($('#othertaxes'+i+'').text());
					total_breakeven=total_breakeven+parseFloat($('#breakeven'+i+'').text());
					total_stt_ctt=total_stt_ctt+parseFloat($('#stt_ctt'+i+'').text());
					total_t_charges=total_t_charges+parseFloat($('#t_charges'+i+'').text());
					total_gst=total_gst+parseFloat($('#gst'+i+'').text());
					total_stamp=total_stamp+parseFloat($('#stamp'+i+'').text());
					total_sebi_fee=total_sebi_fee+parseFloat($('#sebi_fee'+i+'').text());
					total_net_buy_value=total_net_buy_value+parseFloat($('#net_buy_value'+i+'').text());
					total_net_sell_value=total_net_sell_value+parseFloat($('#net_sell_value'+i+'').text());
					if($('#search_company'+i+'').val()!='')
					{
						total_order +='<tr><td>'+ $('#search_company'+i+'').val() +'</td><td>'+ $('#quantity'+i+'').val() +'</td><td>'+ $('#buy_price'+i+'').val() +'</td><td>'+ $('#sell_price'+i+'').val() +'</td><td>'+$('#delivery'+i+'').val()+'</td></tr>';
					}
				}
				$('#FooterBrokerage').text(parseFloat(total_sum_brokerage).toFixed(0));
				$('#brokerage').text(parseFloat(total_sum_brokerage).toFixed(0));
				$('#brokerage_1').text(parseFloat(total_sum_brokerage).toFixed(0));
				$('#FooterBrokerageTaxes').text(parseFloat(total_sum_tax).toFixed(0));
				$('#total_tax').text(parseFloat(total_sum_tax).toFixed(0));
				$('#FooterPnl').text(parseFloat(total_pnl).toFixed(0));
				$('#pnl').text(parseFloat(total_pnl).toFixed(0));
				$('#othertaxes').text(parseFloat(other_charges).toFixed(0));
				$('#breakeven').text(parseFloat(total_breakeven).toFixed(0));
				$('#breakeven_1').text(parseFloat(total_breakeven).toFixed(0));
				$('#stt_ctt').text(parseFloat(total_stt_ctt).toFixed(0));
				$('#t_charges').text(parseFloat(total_t_charges).toFixed(0));
				$('#gst').text(parseFloat(total_gst).toFixed(0));
				$('#stamp').text(parseFloat(total_stamp).toFixed(0));
				$('#sebi_fee').text(parseFloat(total_sebi_fee).toFixed(0));
				$('#total_order').replaceWith('<tbody id="total_order">'+total_order+'</tbody>');
				$('#net_buy_value').text('â‚¹ '+parseFloat(total_net_buy_value).toFixed(0));
				$('#net_sell_value').text('â‚¹ '+parseFloat(total_net_sell_value).toFixed(0));
			}
        },
        error: function(data) {
            $("#notification").css("display", "block");
            setInterval(function() {
                $("#notification").css("display", "none");
            }, 5000);
        },
        dataType: "json",
    });
}


function quantity(num)
{
	var quantity=$('#quantity'+num+'').val();
	
	if(quantity=='' || $('#buy_price'+num+'').val()=='' || $('#sell_price'+num+'').val()=='')
	{
	    $('#net_buy_value'+num+'').text(parseFloat(0).toFixed(0));
		$('#net_sell_value'+num+'').text(parseFloat(0).toFixed(0));
		$('#brokerage'+num+'').text('0.00');
		$('#brokerage_1'+num+'').text('0.00');
		$('#stt_ctt'+num+'').text(parseFloat(0).toFixed(0));
		$('#t_charges'+num+'').text(parseFloat(0).toFixed(0));
		$('#gst'+num+'').text(parseFloat(0).toFixed(0));
		$('#stamp'+num+'').text(parseFloat(0).toFixed(0));
		$('#sebi_fee'+num+'').text(parseFloat(0).toFixed(0));
		$('#othertaxes'+num+'').text(parseFloat(0).toFixed(0));
		$('#breakeven'+num+'').text(parseFloat(0).toFixed(0));
		$('#breakeven_1'+num+'').text(parseFloat(0).toFixed(0));
		$('#total_tax'+num+'').text(parseFloat(0).toFixed(0));
		$('#pnl'+num+'').text(parseFloat(0).toFixed(0));
	}
	else
	{
		if($('#select_check').val()=='intraday')
		{	
            var buy_price=parseFloat($('#buy_price'+num+'').val());
            var percentToGet=(5 / 100) * buy_price;
            var sell_price=buy_price + percentToGet;
            $('#sell_price'+num+'').val(parseFloat(sell_price).toFixed(0));

            var total_sell_price = quantity * (buy_price + percentToGet);
            $('#net_buy_value'+num+'').text(parseFloat(quantity * buy_price).toFixed(0));
			$('#net_sell_value'+num+'').text(parseFloat(total_sell_price).toFixed(0));

			var brokerage=(0.02 / 100)*(total_sell_price + (quantity*buy_price));
			$('#brokerage'+num+'').text(parseFloat(brokerage).toFixed(0));
			$('#brokerage_1'+num+'').text(parseFloat(brokerage).toFixed(0));

			

			var stt_ctt=(0.025 / 100) * total_sell_price;
			$('#stt_ctt'+num+'').text(parseFloat(stt_ctt).toFixed(0));

			var t_charges_sel=(0.00345 / 100) * total_sell_price;
			var t_charges_buy=(0.00345 / 100) * (quantity*buy_price);
			var t_charges=t_charges_sel+t_charges_buy;
			$('#t_charges'+num+'').text(parseFloat(t_charges).toFixed(0));

			var gst=(18 / 100) * (brokerage+t_charges)
			$('#gst'+num+'').text(parseFloat(gst).toFixed(0));

			var stamp=(0.003 / 100) * (quantity*buy_price);
			$('#stamp'+num+'').text(parseFloat(stamp).toFixed(0));

			var sebi_fee=(total_sell_price + (quantity*buy_price))*(10/10000000);
			$('#sebi_fee'+num+'').text(parseFloat(sebi_fee).toFixed(0));

			var othertaxes=sebi_fee+stamp+gst+t_charges+stt_ctt;
			$('#othertaxes'+num+'').text(parseFloat(othertaxes).toFixed(0));

			var total_tax=brokerage + othertaxes;
			$('#total_tax'+num+'').text(parseFloat(total_tax).toFixed(0));

			var breakeven=(((quantity*buy_price)+total_tax)/quantity)-buy_price;
			$('#breakeven'+num+'').text(parseFloat(breakeven).toFixed(0));
			$('#breakeven_1'+num+'').text(parseFloat(breakeven).toFixed(0));

			var pnl=total_sell_price - (quantity*buy_price) - total_tax;
			$('#pnl'+num+'').text(parseFloat(pnl).toFixed(0));		

			var total_sum_brokerage=0;
			var total_sum_tax=0;
			var total_pnl=0;
			var other_charges=0;
			var total_breakeven=0;
			var total_stt_ctt=0;
			var total_t_charges=0;
			var total_gst=0;
			var total_stamp=0;
			var total_sebi_fee=0;
			var total_net_buy_value=0;
			var total_net_sell_value=0;
			var total_order='';
			for (var i = 1; i <= $('#total_order_per').val(); i++) {
				total_sum_brokerage =total_sum_brokerage + parseFloat($('#brokerage'+i+'').text());
				total_sum_tax=total_sum_tax+parseFloat($('#total_tax'+i+'').text());
				total_pnl=total_pnl+parseFloat($('#pnl'+i+'').text());
				other_charges=other_charges+parseFloat($('#othertaxes'+i+'').text());
				total_breakeven=total_breakeven+parseFloat($('#breakeven'+i+'').text());
				total_stt_ctt=total_stt_ctt+parseFloat($('#stt_ctt'+i+'').text());
				total_t_charges=total_t_charges+parseFloat($('#t_charges'+i+'').text());
				total_gst=total_gst+parseFloat($('#gst'+i+'').text());
				total_stamp=total_stamp+parseFloat($('#stamp'+i+'').text());
				total_sebi_fee=total_sebi_fee+parseFloat($('#sebi_fee'+i+'').text());
				total_net_buy_value=total_net_buy_value+parseFloat($('#net_buy_value'+i+'').text());
				total_net_sell_value=total_net_sell_value+parseFloat($('#net_sell_value'+i+'').text());
				if($('#search_company'+i+'').val()!='')
				{
					total_order +='<tr><td>'+ $('#search_company'+i+'').val() +'</td><td>'+ $('#quantity'+i+'').val() +'</td><td>'+ $('#buy_price'+i+'').val() +'</td><td>'+ $('#sell_price'+i+'').val() +'</td><td>'+$('#delivery'+i+'').val()+'</td></tr>';
				}
			}
			$('#FooterBrokerage').text(parseFloat(total_sum_brokerage).toFixed(0));
			$('#brokerage').text(parseFloat(total_sum_brokerage).toFixed(0));
			$('#brokerage_1').text(parseFloat(total_sum_brokerage).toFixed(0));
			$('#FooterBrokerageTaxes').text(parseFloat(total_sum_tax).toFixed(0));
			$('#total_tax').text(parseFloat(total_sum_tax).toFixed(0));
			$('#FooterPnl').text(parseFloat(total_pnl).toFixed(0));
			$('#pnl').text(parseFloat(total_pnl).toFixed(0));
			$('#othertaxes').text(parseFloat(other_charges).toFixed(0));
			$('#breakeven').text(parseFloat(total_breakeven).toFixed(0));
			$('#breakeven_1').text(parseFloat(total_breakeven).toFixed(0));
			$('#stt_ctt').text(parseFloat(total_stt_ctt).toFixed(0));
			$('#t_charges').text(parseFloat(total_t_charges).toFixed(0));
			$('#gst').text(parseFloat(total_gst).toFixed(0));
			$('#stamp').text(parseFloat(total_stamp).toFixed(0));
			$('#sebi_fee').text(parseFloat(total_sebi_fee).toFixed(0));
			$('#total_order').replaceWith('<tbody id="total_order">'+total_order+'</tbody>');
			$('#net_buy_value').text('â‚¹ '+parseFloat(total_net_buy_value).toFixed(0));
			$('#net_sell_value').text('â‚¹ '+parseFloat(total_net_sell_value).toFixed(0));
		}
		else
		{
            var buy_price=parseFloat($('#buy_price'+num+'').val());
            var percentToGet=(5 / 100) * buy_price;
            var sell_price=buy_price + percentToGet;
            $('#sell_price'+num+'').val(parseFloat(sell_price).toFixed(0));

            var total_sell_price = quantity * (buy_price + percentToGet);
            $('#net_buy_value'+num+'').text(parseFloat(quantity * buy_price).toFixed(0));
			$('#net_sell_value'+num+'').text(parseFloat(total_sell_price).toFixed(0));

			var brokerage=(0.2 / 100)*(total_sell_price + (quantity*buy_price));
			$('#brokerage'+num+'').text(parseFloat(brokerage).toFixed(0));
			$('#brokerage_1'+num+'').text(parseFloat(brokerage).toFixed(0));

			

			var stt_ctt=(0.1 / 100) * (total_sell_price + (quantity*buy_price));
			$('#stt_ctt'+num+'').text(parseFloat(stt_ctt).toFixed(0));

			var t_charges_sel=(0.00345 / 100) * total_sell_price;
			var t_charges_buy=(0.00345 / 100) * (quantity*buy_price);
			var t_charges=t_charges_sel+t_charges_buy;
			$('#t_charges'+num+'').text(parseFloat(t_charges).toFixed(0));

			var gst=(18 / 100) * (brokerage+t_charges)
			$('#gst'+num+'').text(parseFloat(gst).toFixed(0));

			var stamp=(0.015 / 100) * (quantity*buy_price);
			$('#stamp'+num+'').text(parseFloat(stamp).toFixed(0));

			var sebi_fee=(total_sell_price + (quantity*buy_price))*(10/10000000);
			$('#sebi_fee'+num+'').text(parseFloat(sebi_fee).toFixed(0));

			var othertaxes=sebi_fee+stamp+gst+t_charges+stt_ctt;
			$('#othertaxes'+num+'').text(parseFloat(othertaxes).toFixed(0));

			var total_tax=brokerage + othertaxes;
			$('#total_tax'+num+'').text(parseFloat(total_tax).toFixed(0));

			var breakeven=(((quantity*buy_price)+total_tax)/quantity)-buy_price;
			$('#breakeven'+num+'').text(parseFloat(breakeven).toFixed(0));
			$('#breakeven_1'+num+'').text(parseFloat(breakeven).toFixed(0));

			var pnl=total_sell_price - (quantity*buy_price) - total_tax;
			$('#pnl'+num+'').text(parseFloat(pnl).toFixed(0));

			var total_sum_brokerage=0;
			var total_sum_tax=0;
			var total_pnl=0;
			var other_charges=0;
			var total_breakeven=0;
			var total_stt_ctt=0;
			var total_t_charges=0;
			var total_gst=0;
			var total_stamp=0;
			var total_sebi_fee=0;
			var total_net_buy_value=0;
			var total_net_sell_value=0;
			var total_order='';
			for (var i = 1; i <= $('#total_order_per').val(); i++) {
				total_sum_brokerage =total_sum_brokerage + parseFloat($('#brokerage'+i+'').text());
				total_sum_tax=total_sum_tax+parseFloat($('#total_tax'+i+'').text());
				total_pnl=total_pnl+parseFloat($('#pnl'+i+'').text());
				other_charges=other_charges+parseFloat($('#othertaxes'+i+'').text());
				total_breakeven=total_breakeven+parseFloat($('#breakeven'+i+'').text());
				total_stt_ctt=total_stt_ctt+parseFloat($('#stt_ctt'+i+'').text());
				total_t_charges=total_t_charges+parseFloat($('#t_charges'+i+'').text());
				total_gst=total_gst+parseFloat($('#gst'+i+'').text());
				total_stamp=total_stamp+parseFloat($('#stamp'+i+'').text());
				total_sebi_fee=total_sebi_fee+parseFloat($('#sebi_fee'+i+'').text());
				total_net_buy_value=total_net_buy_value+parseFloat($('#net_buy_value'+i+'').text());
				total_net_sell_value=total_net_sell_value+parseFloat($('#net_sell_value'+i+'').text());
				if($('#search_company'+i+'').val()!='')
				{
					total_order +='<tr><td>'+ $('#search_company'+i+'').val() +'</td><td>'+ $('#quantity'+i+'').val() +'</td><td>'+ $('#buy_price'+i+'').val() +'</td><td>'+ $('#sell_price'+i+'').val() +'</td><td>'+$('#delivery'+i+'').val()+'</td></tr>';
				}
			}
			$('#FooterBrokerage').text(parseFloat(total_sum_brokerage).toFixed(0));
			$('#brokerage').text(parseFloat(total_sum_brokerage).toFixed(0));
			$('#brokerage_1').text(parseFloat(total_sum_brokerage).toFixed(0));
			$('#FooterBrokerageTaxes').text(parseFloat(total_sum_tax).toFixed(0));
			$('#total_tax').text(parseFloat(total_sum_tax).toFixed(0));
			$('#FooterPnl').text(parseFloat(total_pnl).toFixed(0));
			$('#pnl').text(parseFloat(total_pnl).toFixed(0));
			$('#othertaxes').text(parseFloat(other_charges).toFixed(0));
			$('#breakeven').text(parseFloat(total_breakeven).toFixed(0));
			$('#breakeven_1').text(parseFloat(total_breakeven).toFixed(0));
			$('#stt_ctt').text(parseFloat(total_stt_ctt).toFixed(0));
			$('#t_charges').text(parseFloat(total_t_charges).toFixed(0));
			$('#gst').text(parseFloat(total_gst).toFixed(0));
			$('#stamp').text(parseFloat(total_stamp).toFixed(0));
			$('#sebi_fee').text(parseFloat(total_sebi_fee).toFixed(0));
			$('#total_order').replaceWith('<tbody id="total_order">'+total_order+'</tbody>');
			$('#net_buy_value').text('â‚¹ '+parseFloat(total_net_buy_value).toFixed(0));
			$('#net_sell_value').text('â‚¹ '+parseFloat(total_net_sell_value).toFixed(0));
		}
	}
}

function buy_price(num)
{
	var quantity=$('#quantity'+num+'').val();
	
	if(quantity=='' || $('#buy_price'+num+'').val()=='' || $('#sell_price'+num+'').val()=='')
	{
	    $('#net_buy_value'+num+'').text(parseFloat(0).toFixed(0));
		$('#net_sell_value'+num+'').text(parseFloat(0).toFixed(0));
		$('#brokerage'+num+'').text('0.00');
		$('#brokerage_1'+num+'').text('0.00');
		$('#stt_ctt'+num+'').text(parseFloat(0).toFixed(0));
		$('#t_charges'+num+'').text(parseFloat(0).toFixed(0));
		$('#gst'+num+'').text(parseFloat(0).toFixed(0));
		$('#stamp'+num+'').text(parseFloat(0).toFixed(0));
		$('#sebi_fee'+num+'').text(parseFloat(0).toFixed(0));
		$('#othertaxes'+num+'').text(parseFloat(0).toFixed(0));
		$('#breakeven'+num+'').text(parseFloat(0).toFixed(0));
		$('#breakeven_1'+num+'').text(parseFloat(0).toFixed(0));
		$('#total_tax'+num+'').text(parseFloat(0).toFixed(0));
		$('#pnl'+num+'').text(parseFloat(0).toFixed(0));
	}
	else
	{
		if($('#select_check').val()=='intraday')
		{	
            var buy_price=parseFloat($('#buy_price'+num+'').val());
            var percentToGet=(5 / 100) * buy_price;
            var sell_price=buy_price + percentToGet;
            $('#sell_price'+num+'').val(parseFloat(sell_price).toFixed(0));

            var total_sell_price = quantity * (buy_price + percentToGet);
            $('#net_buy_value'+num+'').text(parseFloat(quantity * buy_price).toFixed(0));
			$('#net_sell_value'+num+'').text(parseFloat(total_sell_price).toFixed(0));

			var brokerage=(0.02 / 100)*(total_sell_price + (quantity*buy_price));
			$('#brokerage'+num+'').text(parseFloat(brokerage).toFixed(0));
			$('#brokerage_1'+num+'').text(parseFloat(brokerage).toFixed(0));

			

			var stt_ctt=(0.025 / 100) * total_sell_price;
			$('#stt_ctt'+num+'').text(parseFloat(stt_ctt).toFixed(0));

			var t_charges_sel=(0.00345 / 100) * total_sell_price;
			var t_charges_buy=(0.00345 / 100) * (quantity*buy_price);
			var t_charges=t_charges_sel+t_charges_buy;
			$('#t_charges'+num+'').text(parseFloat(t_charges).toFixed(0));

			var gst=(18 / 100) * (brokerage+t_charges)
			$('#gst'+num+'').text(parseFloat(gst).toFixed(0));

			var stamp=(0.003 / 100) * (quantity*buy_price);
			$('#stamp'+num+'').text(parseFloat(stamp).toFixed(0));

			var sebi_fee=(total_sell_price + (quantity*buy_price))*(10/10000000);
			$('#sebi_fee'+num+'').text(parseFloat(sebi_fee).toFixed(0));

			var othertaxes=sebi_fee+stamp+gst+t_charges+stt_ctt;
			$('#othertaxes'+num+'').text(parseFloat(othertaxes).toFixed(0));

			var total_tax=brokerage + othertaxes;
			$('#total_tax'+num+'').text(parseFloat(total_tax).toFixed(0));

			var breakeven=(((quantity*buy_price)+total_tax)/quantity)-buy_price;
			$('#breakeven'+num+'').text(parseFloat(breakeven).toFixed(0));
			$('#breakeven_1'+num+'').text(parseFloat(breakeven).toFixed(0));

			var pnl=total_sell_price - (quantity*buy_price) - total_tax;
			$('#pnl'+num+'').text(parseFloat(pnl).toFixed(0));		

			var total_sum_brokerage=0;
			var total_sum_tax=0;
			var total_pnl=0;
			var other_charges=0;
			var total_breakeven=0;
			var total_stt_ctt=0;
			var total_t_charges=0;
			var total_gst=0;
			var total_stamp=0;
			var total_sebi_fee=0;
			var total_net_buy_value=0;
			var total_net_sell_value=0;
			var total_order='';
			for (var i = 1; i <= $('#total_order_per').val(); i++) {
				total_sum_brokerage =total_sum_brokerage + parseFloat($('#brokerage'+i+'').text());
				total_sum_tax=total_sum_tax+parseFloat($('#total_tax'+i+'').text());
				total_pnl=total_pnl+parseFloat($('#pnl'+i+'').text());
				other_charges=other_charges+parseFloat($('#othertaxes'+i+'').text());
				total_breakeven=total_breakeven+parseFloat($('#breakeven'+i+'').text());
				total_stt_ctt=total_stt_ctt+parseFloat($('#stt_ctt'+i+'').text());
				total_t_charges=total_t_charges+parseFloat($('#t_charges'+i+'').text());
				total_gst=total_gst+parseFloat($('#gst'+i+'').text());
				total_stamp=total_stamp+parseFloat($('#stamp'+i+'').text());
				total_sebi_fee=total_sebi_fee+parseFloat($('#sebi_fee'+i+'').text());
				total_net_buy_value=total_net_buy_value+parseFloat($('#net_buy_value'+i+'').text());
				total_net_sell_value=total_net_sell_value+parseFloat($('#net_sell_value'+i+'').text());
				if($('#search_company'+i+'').val()!='')
				{
					total_order +='<tr><td>'+ $('#search_company'+i+'').val() +'</td><td>'+ $('#quantity'+i+'').val() +'</td><td>'+ $('#buy_price'+i+'').val() +'</td><td>'+ $('#sell_price'+i+'').val() +'</td><td>'+$('#delivery'+i+'').val()+'</td></tr>';
				}
			}
			$('#FooterBrokerage').text(parseFloat(total_sum_brokerage).toFixed(0));
			$('#brokerage').text(parseFloat(total_sum_brokerage).toFixed(0));
			$('#brokerage_1').text(parseFloat(total_sum_brokerage).toFixed(0));
			$('#FooterBrokerageTaxes').text(parseFloat(total_sum_tax).toFixed(0));
			$('#total_tax').text(parseFloat(total_sum_tax).toFixed(0));
			$('#FooterPnl').text(parseFloat(total_pnl).toFixed(0));
			$('#pnl').text(parseFloat(total_pnl).toFixed(0));
			$('#othertaxes').text(parseFloat(other_charges).toFixed(0));
			$('#breakeven').text(parseFloat(total_breakeven).toFixed(0));
			$('#breakeven_1').text(parseFloat(total_breakeven).toFixed(0));
			$('#stt_ctt').text(parseFloat(total_stt_ctt).toFixed(0));
			$('#t_charges').text(parseFloat(total_t_charges).toFixed(0));
			$('#gst').text(parseFloat(total_gst).toFixed(0));
			$('#stamp').text(parseFloat(total_stamp).toFixed(0));
			$('#sebi_fee').text(parseFloat(total_sebi_fee).toFixed(0));
			$('#total_order').replaceWith('<tbody id="total_order">'+total_order+'</tbody>');
			$('#net_buy_value').text('â‚¹ '+parseFloat(total_net_buy_value).toFixed(0));
			$('#net_sell_value').text('â‚¹ '+parseFloat(total_net_sell_value).toFixed(0));
		}
		else
		{
            var buy_price=parseFloat($('#buy_price'+num+'').val());
            var percentToGet=(5 / 100) * buy_price;
            var sell_price=buy_price + percentToGet;
            $('#sell_price'+num+'').val(parseFloat(sell_price).toFixed(0));

            var total_sell_price = quantity * (buy_price + percentToGet);
            $('#net_buy_value'+num+'').text(parseFloat(quantity * buy_price).toFixed(0));
			$('#net_sell_value'+num+'').text(parseFloat(total_sell_price).toFixed(0));

			var brokerage=(0.2 / 100)*(total_sell_price + (quantity*buy_price));
			$('#brokerage'+num+'').text(parseFloat(brokerage).toFixed(0));
			$('#brokerage_1'+num+'').text(parseFloat(brokerage).toFixed(0));

			

			var stt_ctt=(0.1 / 100) * (total_sell_price + (quantity*buy_price));
			$('#stt_ctt'+num+'').text(parseFloat(stt_ctt).toFixed(0));

			var t_charges_sel=(0.00345 / 100) * total_sell_price;
			var t_charges_buy=(0.00345 / 100) * (quantity*buy_price);
			var t_charges=t_charges_sel+t_charges_buy;
			$('#t_charges'+num+'').text(parseFloat(t_charges).toFixed(0));

			var gst=(18 / 100) * (brokerage+t_charges)
			$('#gst'+num+'').text(parseFloat(gst).toFixed(0));

			var stamp=(0.015 / 100) * (quantity*buy_price);
			$('#stamp'+num+'').text(parseFloat(stamp).toFixed(0));

			var sebi_fee=(total_sell_price + (quantity*buy_price))*(10/10000000);
			$('#sebi_fee'+num+'').text(parseFloat(sebi_fee).toFixed(0));

			var othertaxes=sebi_fee+stamp+gst+t_charges+stt_ctt;
			$('#othertaxes'+num+'').text(parseFloat(othertaxes).toFixed(0));

			var total_tax=brokerage + othertaxes;
			$('#total_tax'+num+'').text(parseFloat(total_tax).toFixed(0));

			var breakeven=(((quantity*buy_price)+total_tax)/quantity)-buy_price;
			$('#breakeven'+num+'').text(parseFloat(breakeven).toFixed(0));
			$('#breakeven_1'+num+'').text(parseFloat(breakeven).toFixed(0));

			var pnl=total_sell_price - (quantity*buy_price) - total_tax;
			$('#pnl'+num+'').text(parseFloat(pnl).toFixed(0));

			var total_sum_brokerage=0;
			var total_sum_tax=0;
			var total_pnl=0;
			var other_charges=0;
			var total_breakeven=0;
			var total_stt_ctt=0;
			var total_t_charges=0;
			var total_gst=0;
			var total_stamp=0;
			var total_sebi_fee=0;
			var total_net_buy_value=0;
			var total_net_sell_value=0;
			var total_order='';
			for (var i = 1; i <= $('#total_order_per').val(); i++) {
				total_sum_brokerage =total_sum_brokerage + parseFloat($('#brokerage'+i+'').text());
				total_sum_tax=total_sum_tax+parseFloat($('#total_tax'+i+'').text());
				total_pnl=total_pnl+parseFloat($('#pnl'+i+'').text());
				other_charges=other_charges+parseFloat($('#othertaxes'+i+'').text());
				total_breakeven=total_breakeven+parseFloat($('#breakeven'+i+'').text());
				total_stt_ctt=total_stt_ctt+parseFloat($('#stt_ctt'+i+'').text());
				total_t_charges=total_t_charges+parseFloat($('#t_charges'+i+'').text());
				total_gst=total_gst+parseFloat($('#gst'+i+'').text());
				total_stamp=total_stamp+parseFloat($('#stamp'+i+'').text());
				total_sebi_fee=total_sebi_fee+parseFloat($('#sebi_fee'+i+'').text());
				total_net_buy_value=total_net_buy_value+parseFloat($('#net_buy_value'+i+'').text());
				total_net_sell_value=total_net_sell_value+parseFloat($('#net_sell_value'+i+'').text());
				if($('#search_company'+i+'').val()!='')
				{
					total_order +='<tr><td>'+ $('#search_company'+i+'').val() +'</td><td>'+ $('#quantity'+i+'').val() +'</td><td>'+ $('#buy_price'+i+'').val() +'</td><td>'+ $('#sell_price'+i+'').val() +'</td><td>'+$('#delivery'+i+'').val()+'</td></tr>';
				}
			}
			$('#FooterBrokerage').text(parseFloat(total_sum_brokerage).toFixed(0));
			$('#brokerage').text(parseFloat(total_sum_brokerage).toFixed(0));
			$('#brokerage_1').text(parseFloat(total_sum_brokerage).toFixed(0));
			$('#FooterBrokerageTaxes').text(parseFloat(total_sum_tax).toFixed(0));
			$('#total_tax').text(parseFloat(total_sum_tax).toFixed(0));
			$('#FooterPnl').text(parseFloat(total_pnl).toFixed(0));
			$('#pnl').text(parseFloat(total_pnl).toFixed(0));
			$('#othertaxes').text(parseFloat(other_charges).toFixed(0));
			$('#breakeven').text(parseFloat(total_breakeven).toFixed(0));
			$('#breakeven_1').text(parseFloat(total_breakeven).toFixed(0));
			$('#stt_ctt').text(parseFloat(total_stt_ctt).toFixed(0));
			$('#t_charges').text(parseFloat(total_t_charges).toFixed(0));
			$('#gst').text(parseFloat(total_gst).toFixed(0));
			$('#stamp').text(parseFloat(total_stamp).toFixed(0));
			$('#sebi_fee').text(parseFloat(total_sebi_fee).toFixed(0));
			$('#total_order').replaceWith('<tbody id="total_order">'+total_order+'</tbody>');
			$('#net_buy_value').text('â‚¹ '+parseFloat(total_net_buy_value).toFixed(0));
			$('#net_sell_value').text('â‚¹ '+parseFloat(total_net_sell_value).toFixed(0));
		}
	}
}

function sell_price(num)
{
	var quantity=$('#quantity'+num+'').val();
	
	if(quantity=='' || $('#buy_price'+num+'').val()=='' || $('#sell_price'+num+'').val()=='')
	{
	    $('#net_buy_value'+num+'').text(parseFloat(0).toFixed(0));
		$('#net_sell_value'+num+'').text(parseFloat(0).toFixed(0));
		$('#brokerage'+num+'').text('0.00');
		$('#brokerage_1'+num+'').text('0.00');
		$('#stt_ctt'+num+'').text(parseFloat(0).toFixed(0));
		$('#t_charges'+num+'').text(parseFloat(0).toFixed(0));
		$('#gst'+num+'').text(parseFloat(0).toFixed(0));
		$('#stamp'+num+'').text(parseFloat(0).toFixed(0));
		$('#sebi_fee'+num+'').text(parseFloat(0).toFixed(0));
		$('#othertaxes'+num+'').text(parseFloat(0).toFixed(0));
		$('#breakeven'+num+'').text(parseFloat(0).toFixed(0));
		$('#breakeven_1'+num+'').text(parseFloat(0).toFixed(0));
		$('#total_tax'+num+'').text(parseFloat(0).toFixed(0));
		$('#pnl'+num+'').text(parseFloat(0).toFixed(0));
	}
	else
	{
		if($('#select_check').val()=='intraday')
		{	
            var buy_price=parseFloat($('#buy_price'+num+'').val());
            var percentToGet=(5 / 100) * buy_price;
            var sell_price=buy_price + percentToGet;
            $('#sell_price'+num+'').val(parseFloat(sell_price).toFixed(0));

            var total_sell_price = quantity * (buy_price + percentToGet);
            $('#net_buy_value'+num+'').text(parseFloat(quantity * buy_price).toFixed(0));
			$('#net_sell_value'+num+'').text(parseFloat(total_sell_price).toFixed(0));

			var brokerage=(0.02 / 100)*(total_sell_price + (quantity*buy_price));
			$('#brokerage'+num+'').text(parseFloat(brokerage).toFixed(0));
			$('#brokerage_1'+num+'').text(parseFloat(brokerage).toFixed(0));

			

			var stt_ctt=(0.025 / 100) * total_sell_price;
			$('#stt_ctt'+num+'').text(parseFloat(stt_ctt).toFixed(0));

			var t_charges_sel=(0.00345 / 100) * total_sell_price;
			var t_charges_buy=(0.00345 / 100) * (quantity*buy_price);
			var t_charges=t_charges_sel+t_charges_buy;
			$('#t_charges'+num+'').text(parseFloat(t_charges).toFixed(0));

			var gst=(18 / 100) * (brokerage+t_charges)
			$('#gst'+num+'').text(parseFloat(gst).toFixed(0));

			var stamp=(0.003 / 100) * (quantity*buy_price);
			$('#stamp'+num+'').text(parseFloat(stamp).toFixed(0));

			var sebi_fee=(total_sell_price + (quantity*buy_price))*(10/10000000);
			$('#sebi_fee'+num+'').text(parseFloat(sebi_fee).toFixed(0));

			var othertaxes=sebi_fee+stamp+gst+t_charges+stt_ctt;
			$('#othertaxes'+num+'').text(parseFloat(othertaxes).toFixed(0));

			var total_tax=brokerage + othertaxes;
			$('#total_tax'+num+'').text(parseFloat(total_tax).toFixed(0));

			var breakeven=(((quantity*buy_price)+total_tax)/quantity)-buy_price;
			$('#breakeven'+num+'').text(parseFloat(breakeven).toFixed(0));
			$('#breakeven_1'+num+'').text(parseFloat(breakeven).toFixed(0));

			var pnl=total_sell_price - (quantity*buy_price) - total_tax;
			$('#pnl'+num+'').text(parseFloat(pnl).toFixed(0));		

			var total_sum_brokerage=0;
			var total_sum_tax=0;
			var total_pnl=0;
			var other_charges=0;
			var total_breakeven=0;
			var total_stt_ctt=0;
			var total_t_charges=0;
			var total_gst=0;
			var total_stamp=0;
			var total_sebi_fee=0;
			var total_net_buy_value=0;
			var total_net_sell_value=0;
			var total_order='';
			for (var i = 1; i <= $('#total_order_per').val(); i++) {
				total_sum_brokerage =total_sum_brokerage + parseFloat($('#brokerage'+i+'').text());
				total_sum_tax=total_sum_tax+parseFloat($('#total_tax'+i+'').text());
				total_pnl=total_pnl+parseFloat($('#pnl'+i+'').text());
				other_charges=other_charges+parseFloat($('#othertaxes'+i+'').text());
				total_breakeven=total_breakeven+parseFloat($('#breakeven'+i+'').text());
				total_stt_ctt=total_stt_ctt+parseFloat($('#stt_ctt'+i+'').text());
				total_t_charges=total_t_charges+parseFloat($('#t_charges'+i+'').text());
				total_gst=total_gst+parseFloat($('#gst'+i+'').text());
				total_stamp=total_stamp+parseFloat($('#stamp'+i+'').text());
				total_sebi_fee=total_sebi_fee+parseFloat($('#sebi_fee'+i+'').text());
				total_net_buy_value=total_net_buy_value+parseFloat($('#net_buy_value'+i+'').text());
				total_net_sell_value=total_net_sell_value+parseFloat($('#net_sell_value'+i+'').text());
				if($('#search_company'+i+'').val()!='')
				{
					total_order +='<tr><td>'+ $('#search_company'+i+'').val() +'</td><td>'+ $('#quantity'+i+'').val() +'</td><td>'+ $('#buy_price'+i+'').val() +'</td><td>'+ $('#sell_price'+i+'').val() +'</td><td>'+$('#delivery'+i+'').val()+'</td></tr>';
				}
			}
			$('#FooterBrokerage').text(parseFloat(total_sum_brokerage).toFixed(0));
			$('#brokerage').text(parseFloat(total_sum_brokerage).toFixed(0));
			$('#brokerage_1').text(parseFloat(total_sum_brokerage).toFixed(0));
			$('#FooterBrokerageTaxes').text(parseFloat(total_sum_tax).toFixed(0));
			$('#total_tax').text(parseFloat(total_sum_tax).toFixed(0));
			$('#FooterPnl').text(parseFloat(total_pnl).toFixed(0));
			$('#pnl').text(parseFloat(total_pnl).toFixed(0));
			$('#othertaxes').text(parseFloat(other_charges).toFixed(0));
			$('#breakeven').text(parseFloat(total_breakeven).toFixed(0));
			$('#breakeven_1').text(parseFloat(total_breakeven).toFixed(0));
			$('#stt_ctt').text(parseFloat(total_stt_ctt).toFixed(0));
			$('#t_charges').text(parseFloat(total_t_charges).toFixed(0));
			$('#gst').text(parseFloat(total_gst).toFixed(0));
			$('#stamp').text(parseFloat(total_stamp).toFixed(0));
			$('#sebi_fee').text(parseFloat(total_sebi_fee).toFixed(0));
			$('#total_order').replaceWith('<tbody id="total_order">'+total_order+'</tbody>');
			$('#net_buy_value').text('â‚¹ '+parseFloat(total_net_buy_value).toFixed(0));
			$('#net_sell_value').text('â‚¹ '+parseFloat(total_net_sell_value).toFixed(0));
		}
		else
		{
            var buy_price=parseFloat($('#buy_price'+num+'').val());
            var percentToGet=(5 / 100) * buy_price;
            var sell_price=buy_price + percentToGet;
            $('#sell_price'+num+'').val(parseFloat(sell_price).toFixed(0));

            var total_sell_price = quantity * (buy_price + percentToGet);
            $('#net_buy_value'+num+'').text(parseFloat(quantity * buy_price).toFixed(0));
			$('#net_sell_value'+num+'').text(parseFloat(total_sell_price).toFixed(0));

			var brokerage=(0.2 / 100)*(total_sell_price + (quantity*buy_price));
			$('#brokerage'+num+'').text(parseFloat(brokerage).toFixed(0));
			$('#brokerage_1'+num+'').text(parseFloat(brokerage).toFixed(0));

			

			var stt_ctt=(0.1 / 100) * (total_sell_price + (quantity*buy_price));
			$('#stt_ctt'+num+'').text(parseFloat(stt_ctt).toFixed(0));

			var t_charges_sel=(0.00345 / 100) * total_sell_price;
			var t_charges_buy=(0.00345 / 100) * (quantity*buy_price);
			var t_charges=t_charges_sel+t_charges_buy;
			$('#t_charges'+num+'').text(parseFloat(t_charges).toFixed(0));

			var gst=(18 / 100) * (brokerage+t_charges)
			$('#gst'+num+'').text(parseFloat(gst).toFixed(0));

			var stamp=(0.015 / 100) * (quantity*buy_price);
			$('#stamp'+num+'').text(parseFloat(stamp).toFixed(0));

			var sebi_fee=(total_sell_price + (quantity*buy_price))*(10/10000000);
			$('#sebi_fee'+num+'').text(parseFloat(sebi_fee).toFixed(0));

			var othertaxes=sebi_fee+stamp+gst+t_charges+stt_ctt;
			$('#othertaxes'+num+'').text(parseFloat(othertaxes).toFixed(0));

			var total_tax=brokerage + othertaxes;
			$('#total_tax'+num+'').text(parseFloat(total_tax).toFixed(0));

			var breakeven=(((quantity*buy_price)+total_tax)/quantity)-buy_price;
			$('#breakeven'+num+'').text(parseFloat(breakeven).toFixed(0));
			$('#breakeven_1'+num+'').text(parseFloat(breakeven).toFixed(0));

			var pnl=total_sell_price - (quantity*buy_price) - total_tax;
			$('#pnl'+num+'').text(parseFloat(pnl).toFixed(0));

			var total_sum_brokerage=0;
			var total_sum_tax=0;
			var total_pnl=0;
			var other_charges=0;
			var total_breakeven=0;
			var total_stt_ctt=0;
			var total_t_charges=0;
			var total_gst=0;
			var total_stamp=0;
			var total_sebi_fee=0;
			var total_net_buy_value=0;
			var total_net_sell_value=0;
			var total_order='';
			for (var i = 1; i <= $('#total_order_per').val(); i++) {
				total_sum_brokerage =total_sum_brokerage + parseFloat($('#brokerage'+i+'').text());
				total_sum_tax=total_sum_tax+parseFloat($('#total_tax'+i+'').text());
				total_pnl=total_pnl+parseFloat($('#pnl'+i+'').text());
				other_charges=other_charges+parseFloat($('#othertaxes'+i+'').text());
				total_breakeven=total_breakeven+parseFloat($('#breakeven'+i+'').text());
				total_stt_ctt=total_stt_ctt+parseFloat($('#stt_ctt'+i+'').text());
				total_t_charges=total_t_charges+parseFloat($('#t_charges'+i+'').text());
				total_gst=total_gst+parseFloat($('#gst'+i+'').text());
				total_stamp=total_stamp+parseFloat($('#stamp'+i+'').text());
				total_sebi_fee=total_sebi_fee+parseFloat($('#sebi_fee'+i+'').text());
				total_net_buy_value=total_net_buy_value+parseFloat($('#net_buy_value'+i+'').text());
				total_net_sell_value=total_net_sell_value+parseFloat($('#net_sell_value'+i+'').text());
				if($('#search_company'+i+'').val()!='')
				{
					total_order +='<tr><td>'+ $('#search_company'+i+'').val() +'</td><td>'+ $('#quantity'+i+'').val() +'</td><td>'+ $('#buy_price'+i+'').val() +'</td><td>'+ $('#sell_price'+i+'').val() +'</td><td>'+$('#delivery'+i+'').val()+'</td></tr>';
				}
			}
			$('#FooterBrokerage').text(parseFloat(total_sum_brokerage).toFixed(0));
			$('#brokerage').text(parseFloat(total_sum_brokerage).toFixed(0));
			$('#brokerage_1').text(parseFloat(total_sum_brokerage).toFixed(0));
			$('#FooterBrokerageTaxes').text(parseFloat(total_sum_tax).toFixed(0));
			$('#total_tax').text(parseFloat(total_sum_tax).toFixed(0));
			$('#FooterPnl').text(parseFloat(total_pnl).toFixed(0));
			$('#pnl').text(parseFloat(total_pnl).toFixed(0));
			$('#othertaxes').text(parseFloat(other_charges).toFixed(0));
			$('#breakeven').text(parseFloat(total_breakeven).toFixed(0));
			$('#breakeven_1').text(parseFloat(total_breakeven).toFixed(0));
			$('#stt_ctt').text(parseFloat(total_stt_ctt).toFixed(0));
			$('#t_charges').text(parseFloat(total_t_charges).toFixed(0));
			$('#gst').text(parseFloat(total_gst).toFixed(0));
			$('#stamp').text(parseFloat(total_stamp).toFixed(0));
			$('#sebi_fee').text(parseFloat(total_sebi_fee).toFixed(0));
			$('#total_order').replaceWith('<tbody id="total_order">'+total_order+'</tbody>');
			$('#net_buy_value').text('â‚¹ '+parseFloat(total_net_buy_value).toFixed(0));
			$('#net_sell_value').text('â‚¹ '+parseFloat(total_net_sell_value).toFixed(0));
		}
	}
}

function check_box(a, e, num)
{
	var i, tablinks;
	tablinks = document.getElementsByClassName("tablinks"+num+"");
	for (i = 0; i < tablinks.length; i++) {
		tablinks[i].className = "tablinks"+num+" no_check_btn";
	}
	$(e).addClass('check_btn');
    $(e).removeClass('no_check_btn');
	var quantity=$('#quantity'+num+'').val();
	if(quantity=='' || $('#buy_price'+num+'').val()=='' || $('#sell_price'+num+'').val()=='')
	{
		if(a=='intraday')
		{
			$('#delivery'+num+'').val('intraday')
			$('#select_check').val('intraday')
		}
		else
		{
			$('#delivery'+num+'').val('delivery')
			$('#select_check').val('delivery')
		}
	    $('#net_buy_value'+num+'').text(parseFloat(0).toFixed(0));
		$('#net_sell_value'+num+'').text(parseFloat(0).toFixed(0));
		$('#brokerage'+num+'').text('0.00');
		$('#brokerage_1'+num+'').text('0.00');
		$('#stt_ctt'+num+'').text(parseFloat(0).toFixed(0));
		$('#t_charges'+num+'').text(parseFloat(0).toFixed(0));
		$('#gst'+num+'').text(parseFloat(0).toFixed(0));
		$('#stamp'+num+'').text(parseFloat(0).toFixed(0));
		$('#sebi_fee'+num+'').text(parseFloat(0).toFixed(0));
		$('#othertaxes'+num+'').text(parseFloat(0).toFixed(0));
		$('#breakeven'+num+'').text(parseFloat(0).toFixed(0));
		$('#breakeven_1'+num+'').text(parseFloat(0).toFixed(0));
		$('#total_tax'+num+'').text(parseFloat(0).toFixed(0));
		$('#pnl'+num+'').text(parseFloat(0).toFixed(0));
	}
	else
	{
		if(a=='intraday')
		{
			$('#delivery'+num+'').val('intraday')
			$('#select_check').val('intraday')
			var buy_price=parseFloat($('#buy_price'+num+'').val());
            var percentToGet=(5 / 100) * buy_price;
            var sell_price=buy_price + percentToGet;
            $('#sell_price'+num+'').val(parseFloat(sell_price).toFixed(0));

            var total_sell_price = quantity * (buy_price + percentToGet);
            $('#net_buy_value'+num+'').text(parseFloat(quantity * buy_price).toFixed(0));
			$('#net_sell_value'+num+'').text(parseFloat(total_sell_price).toFixed(0));

			var brokerage=(0.02 / 100)*(total_sell_price + (quantity*buy_price));
			$('#brokerage'+num+'').text(parseFloat(brokerage).toFixed(0));
			$('#brokerage_1'+num+'').text(parseFloat(brokerage).toFixed(0));

			

			var stt_ctt=(0.025 / 100) * total_sell_price;
			$('#stt_ctt'+num+'').text(parseFloat(stt_ctt).toFixed(0));

			var t_charges_sel=(0.00345 / 100) * total_sell_price;
			var t_charges_buy=(0.00345 / 100) * (quantity*buy_price);
			var t_charges=t_charges_sel+t_charges_buy;
			$('#t_charges'+num+'').text(parseFloat(t_charges).toFixed(0));

			var gst=(18 / 100) * (brokerage+t_charges)
			$('#gst'+num+'').text(parseFloat(gst).toFixed(0));

			var stamp=(0.003 / 100) * (quantity*buy_price);
			$('#stamp'+num+'').text(parseFloat(stamp).toFixed(0));

			var sebi_fee=(total_sell_price + (quantity*buy_price))*(10/10000000);
			$('#sebi_fee'+num+'').text(parseFloat(sebi_fee).toFixed(0));

			var othertaxes=sebi_fee+stamp+gst+t_charges+stt_ctt;
			$('#othertaxes'+num+'').text(parseFloat(othertaxes).toFixed(0));

			var total_tax=brokerage + othertaxes;
			$('#total_tax'+num+'').text(parseFloat(total_tax).toFixed(0));

			var breakeven=(((quantity*buy_price)+total_tax)/quantity)-buy_price;
			$('#breakeven'+num+'').text(parseFloat(breakeven).toFixed(0));
			$('#breakeven_1'+num+'').text(parseFloat(breakeven).toFixed(0));

			var pnl=total_sell_price - (quantity*buy_price) - total_tax;
			$('#pnl'+num+'').text(parseFloat(pnl).toFixed(0));

			var total_sum_brokerage=0;
			var total_sum_tax=0;
			var total_pnl=0;
			var other_charges=0;
			var total_breakeven=0;
			var total_stt_ctt=0;
			var total_t_charges=0;
			var total_gst=0;
			var total_stamp=0;
			var total_sebi_fee=0;
			var total_net_buy_value=0;
			var total_net_sell_value=0;
			var total_order='';
			for (var i = 1; i <= $('#total_order_per').val(); i++) {
				total_sum_brokerage =total_sum_brokerage + parseFloat($('#brokerage'+i+'').text());
				total_sum_tax=total_sum_tax+parseFloat($('#total_tax'+i+'').text());
				total_pnl=total_pnl+parseFloat($('#pnl'+i+'').text());
				other_charges=other_charges+parseFloat($('#othertaxes'+i+'').text());
				total_breakeven=total_breakeven+parseFloat($('#breakeven'+i+'').text());
				total_stt_ctt=total_stt_ctt+parseFloat($('#stt_ctt'+i+'').text());
				total_t_charges=total_t_charges+parseFloat($('#t_charges'+i+'').text());
				total_gst=total_gst+parseFloat($('#gst'+i+'').text());
				total_stamp=total_stamp+parseFloat($('#stamp'+i+'').text());
				total_sebi_fee=total_sebi_fee+parseFloat($('#sebi_fee'+i+'').text());
				total_net_buy_value=total_net_buy_value+parseFloat($('#net_buy_value'+i+'').text());
				total_net_sell_value=total_net_sell_value+parseFloat($('#net_sell_value'+i+'').text());
				if($('#search_company'+i+'').val()!='')
				{
					total_order +='<tr><td>'+ $('#search_company'+i+'').val() +'</td><td>'+ $('#quantity'+i+'').val() +'</td><td>'+ $('#buy_price'+i+'').val() +'</td><td>'+ $('#sell_price'+i+'').val() +'</td><td>'+$('#delivery'+i+'').val()+'</td></tr>';
				}
			}
			$('#FooterBrokerage').text(parseFloat(total_sum_brokerage).toFixed(0));
			$('#brokerage').text(parseFloat(total_sum_brokerage).toFixed(0));
			$('#brokerage_1').text(parseFloat(total_sum_brokerage).toFixed(0));
			$('#FooterBrokerageTaxes').text(parseFloat(total_sum_tax).toFixed(0));
			$('#total_tax').text(parseFloat(total_sum_tax).toFixed(0));
			$('#FooterPnl').text(parseFloat(total_pnl).toFixed(0));
			$('#pnl').text(parseFloat(total_pnl).toFixed(0));
			$('#othertaxes').text(parseFloat(other_charges).toFixed(0));
			$('#breakeven').text(parseFloat(total_breakeven).toFixed(0));
			$('#breakeven_1').text(parseFloat(total_breakeven).toFixed(0));
			$('#stt_ctt').text(parseFloat(total_stt_ctt).toFixed(0));
			$('#t_charges').text(parseFloat(total_t_charges).toFixed(0));
			$('#gst').text(parseFloat(total_gst).toFixed(0));
			$('#stamp').text(parseFloat(total_stamp).toFixed(0));
			$('#sebi_fee').text(parseFloat(total_sebi_fee).toFixed(0));
			$('#total_order').replaceWith('<tbody id="total_order">'+total_order+'</tbody>');
			$('#net_buy_value').text('â‚¹ '+parseFloat(total_net_buy_value).toFixed(0));
			$('#net_sell_value').text('â‚¹ '+parseFloat(total_net_sell_value).toFixed(0));
		}
		else
		{
			$('#delivery'+num+'').val('delivery')
			$('#select_check').val('delivery');
			var buy_price=parseFloat($('#buy_price'+num+'').val());
            var percentToGet=(5 / 100) * buy_price;
            var sell_price=buy_price + percentToGet;
            $('#sell_price'+num+'').val(parseFloat(sell_price).toFixed(0));

            var total_sell_price = quantity * (buy_price + percentToGet);
            $('#net_buy_value'+num+'').text(parseFloat(quantity * buy_price).toFixed(0));
			$('#net_sell_value'+num+'').text(parseFloat(total_sell_price).toFixed(0));

			var brokerage=(0.2 / 100)*(total_sell_price + (quantity*buy_price));
			$('#brokerage'+num+'').text(parseFloat(brokerage).toFixed(0));
			$('#brokerage_1'+num+'').text(parseFloat(brokerage).toFixed(0));

			

			var stt_ctt=(0.1 / 100) * (total_sell_price + (quantity*buy_price));
			$('#stt_ctt'+num+'').text(parseFloat(stt_ctt).toFixed(0));

			var t_charges_sel=(0.00345 / 100) * total_sell_price;
			var t_charges_buy=(0.00345 / 100) * (quantity*buy_price);
			var t_charges=t_charges_sel+t_charges_buy;
			$('#t_charges'+num+'').text(parseFloat(t_charges).toFixed(0));

			var gst=(18 / 100) * (brokerage+t_charges)
			$('#gst'+num+'').text(parseFloat(gst).toFixed(0));

			var stamp=(0.015 / 100) * (quantity*buy_price);
			$('#stamp'+num+'').text(parseFloat(stamp).toFixed(0));

			var sebi_fee=(total_sell_price + (quantity*buy_price))*(10/10000000);
			$('#sebi_fee'+num+'').text(parseFloat(sebi_fee).toFixed(0));

			var othertaxes=sebi_fee+stamp+gst+t_charges+stt_ctt;
			$('#othertaxes'+num+'').text(parseFloat(othertaxes).toFixed(0));

			var total_tax=brokerage + othertaxes;
			$('#total_tax'+num+'').text(parseFloat(total_tax).toFixed(0));

			var breakeven=(((quantity*buy_price)+total_tax)/quantity)-buy_price;
			$('#breakeven'+num+'').text(parseFloat(breakeven).toFixed(0));
			$('#breakeven_1'+num+'').text(parseFloat(breakeven).toFixed(0));

			var pnl=total_sell_price - (quantity*buy_price) - total_tax;
			$('#pnl'+num+'').text(parseFloat(pnl).toFixed(0));

			var total_sum_brokerage=0;
			var total_sum_tax=0;
			var total_pnl=0;
			var other_charges=0;
			var total_breakeven=0;
			var total_stt_ctt=0;
			var total_t_charges=0;
			var total_gst=0;
			var total_stamp=0;
			var total_sebi_fee=0;
			var total_net_buy_value=0;
			var total_net_sell_value=0;
			var total_order='';
			for (var i = 1; i <= $('#total_order_per').val(); i++) {
				total_sum_brokerage =total_sum_brokerage + parseFloat($('#brokerage'+i+'').text());
				total_sum_tax=total_sum_tax+parseFloat($('#total_tax'+i+'').text());
				total_pnl=total_pnl+parseFloat($('#pnl'+i+'').text());
				other_charges=other_charges+parseFloat($('#othertaxes'+i+'').text());
				total_breakeven=total_breakeven+parseFloat($('#breakeven'+i+'').text());
				total_stt_ctt=total_stt_ctt+parseFloat($('#stt_ctt'+i+'').text());
				total_t_charges=total_t_charges+parseFloat($('#t_charges'+i+'').text());
				total_gst=total_gst+parseFloat($('#gst'+i+'').text());
				total_stamp=total_stamp+parseFloat($('#stamp'+i+'').text());
				total_sebi_fee=total_sebi_fee+parseFloat($('#sebi_fee'+i+'').text());
				total_net_buy_value=total_net_buy_value+parseFloat($('#net_buy_value'+i+'').text());
				total_net_sell_value=total_net_sell_value+parseFloat($('#net_sell_value'+i+'').text());
				if($('#search_company'+i+'').val()!='')
				{
					total_order +='<tr><td>'+ $('#search_company'+i+'').val() +'</td><td>'+ $('#quantity'+i+'').val() +'</td><td>'+ $('#buy_price'+i+'').val() +'</td><td>'+ $('#sell_price'+i+'').val() +'</td><td>'+$('#delivery'+i+'').val()+'</td></tr>';
				}
			}
			$('#FooterBrokerage').text(parseFloat(total_sum_brokerage).toFixed(0));
			$('#brokerage').text(parseFloat(total_sum_brokerage).toFixed(0));
			$('#brokerage_1').text(parseFloat(total_sum_brokerage).toFixed(0));
			$('#FooterBrokerageTaxes').text(parseFloat(total_sum_tax).toFixed(0));
			$('#total_tax').text(parseFloat(total_sum_tax).toFixed(0));
			$('#FooterPnl').text(parseFloat(total_pnl).toFixed(0));
			$('#pnl').text(parseFloat(total_pnl).toFixed(0));
			$('#othertaxes').text(parseFloat(other_charges).toFixed(0));
			$('#breakeven').text(parseFloat(total_breakeven).toFixed(0));
			$('#breakeven_1').text(parseFloat(total_breakeven).toFixed(0));
			$('#stt_ctt').text(parseFloat(total_stt_ctt).toFixed(0));
			$('#t_charges').text(parseFloat(total_t_charges).toFixed(0));
			$('#gst').text(parseFloat(total_gst).toFixed(0));
			$('#stamp').text(parseFloat(total_stamp).toFixed(0));
			$('#sebi_fee').text(parseFloat(total_sebi_fee).toFixed(0));
			$('#total_order').replaceWith('<tbody id="total_order">'+total_order+'</tbody>');
			$('#net_buy_value').text('â‚¹ '+parseFloat(total_net_buy_value).toFixed(0));
			$('#net_sell_value').text('â‚¹ '+parseFloat(total_net_sell_value).toFixed(0));
		}	    
	}
}



function add_another(num)
{
	var addnum=parseFloat(num)+1;
	var subnum=num-1;
	$('#brokerage_calcutor').append('<div class="col-sm-12 col-lg-8 col-md-offset-2 brokerage-section m-auto mb-5"><div class="row"><div class="col-md-3 mb-4"><button class="tablinks'+num+' check_btn" id="intraday" onclick="check_box(\'intraday\',this,\''+num+'\')">Intraday</button></div><div class="col-md-3 mb-4"><button class="tablinks'+num+' no_check_btn" id="delivery'+num+'" value="intraday" onclick="check_box(\'delivery\',this,\''+num+'\')">Delivery</button></div></div><div class="search-input" id="search-input'+num+'"><input type="search" name="" id="search_company'+num+'" placeholder="Enter atleast 3 characters of symbols or name" onkeyup="search_company_byword('+num+')"><div class="autocom-box" id="autocom-box'+num+'"></div></div><div class="row text-left mt-5 mb-5"><div class="col-md-4 input_div"><div>Quantity</div><input type="number" value="1" id="quantity'+num+'" onkeyup="quantity(\''+num+'\')"></div><div class="col-md-4 input_div"><div>Buy Price</div><input type="number" class="pricetext" id="buy_price'+num+'" onkeyup="buy_price(\''+num+'\')"></div><div class="col-md-4 input_div"><div>Sell Price</div><input type="number" class="pricetext" id="sell_price'+num+'" onkeyup="sell_price(\''+num+'\')"></div></div><div class="brokerage_charge"><div class="row"><div class="col-md-3 col-sm-3 col-xs-6 charges"><div>Brokerage</div><span>â‚¹&nbsp;<span id="brokerage'+num+'">0.00</span></span></div><div class="col-md-3 col-sm-3 col-xs-6 charges"><div>Other Charges</div><span>â‚¹&nbsp;<span id="othertaxes'+num+'">0.00</span></span></div><div class="col-md-3 col-sm-3 col-xs-6 charges"><div>Breakeven</div><span>â‚¹&nbsp;<span id="breakeven'+num+'">0.00</span></span></div><div class="col-md-3 col-sm-3 col-xs-6 charges"><div>Net PnL</div><span class="lblTotalNetPnl">â‚¹&nbsp;<span id="pnl'+num+'">0.00</span></span></div><div class="clearfix"></div><div class="col-md-12"><hr class="hr_line"></div></div><div class="total_brokerage" id="total_brokerage'+num+'"><div class="row all_text" id="all_text'+num+'"><div class="col-md-6 brokerage_summary"><p>Brokerage<span>â‚¹&nbsp;<span id="brokerage_1'+num+'">0.00</span></span></p><p>STT/CTT <span>â‚¹&nbsp;<span id="stt_ctt'+num+'">0.00</span></span></p><p>Transaction Charges<span>â‚¹&nbsp;<span id="t_charges'+num+'">0.00</span></span></p><p>GST<span>â‚¹&nbsp;<span id="gst'+num+'">0.00</span></span></p><p>State Stamp Duty<span>â‚¹&nbsp;<span id="stamp'+num+'">0.00</span></span></p><p>SEBI Turnover Fees<span>â‚¹&nbsp;<span id="sebi_fee'+num+'">0.00</span></span></p><p class="total">TOTAL TAXES AND CHARGES<span>â‚¹&nbsp;<span id="total_tax'+num+'">0.00</span></span></p></div><div class="col-md-6 brokerage_summary"><p>Net Buy Value <span>â‚¹&nbsp;<span id="net_buy_value'+num+'">0.00</span></span></p><p>Net Sell Value <span>â‚¹&nbsp;<span id="net_sell_value'+num+'">0.00</span></span></p><p>Breakeven <span id="breakeven_1'+num+'">â‚¹&nbsp;0.00</span></p></div></div></div><div class="charge_section"><button type="button" onclick="click_txt(\''+num+'\')"><span id="click_txt'+num+'">View Charges Breakup</span> <i class="fas fa-chevron-circle-down" id="fa_icon'+num+'"></i></button></div></div></div><div class="col-sm-12 col-md-12 mt-3 mb-11" align="center" id="add_btn'+num+'"><button class="add_btn" onclick="add_another(\''+addnum+'\')">Add another order +</button></div>');
	$('#add_btn'+subnum+'').hide();
	$('#summary_div').show();
	$('#total_order_per').val(num)

	var total_sum_brokerage=0;
	var total_sum_tax=0;
	var total_pnl=0;
	var other_charges=0;
	var total_breakeven=0;
	var total_stt_ctt=0;
	var total_t_charges=0;
	var total_gst=0;
	var total_stamp=0;
	var total_sebi_fee=0;
	var total_net_buy_value=0;
	var total_net_sell_value=0;
	var total_order='';
	for (var i = 1; i <= num; i++) {
		total_sum_brokerage =total_sum_brokerage + parseFloat($('#brokerage'+i+'').text());
		total_sum_tax=total_sum_tax+parseFloat($('#total_tax'+i+'').text());
		total_pnl=total_pnl+parseFloat($('#pnl'+i+'').text());
		other_charges=other_charges+parseFloat($('#othertaxes'+i+'').text());
		total_breakeven=total_breakeven+parseFloat($('#breakeven'+i+'').text());
		total_stt_ctt=total_stt_ctt+parseFloat($('#stt_ctt'+i+'').text());
		total_t_charges=total_t_charges+parseFloat($('#t_charges'+i+'').text());
		total_gst=total_gst+parseFloat($('#gst'+i+'').text());
		total_stamp=total_stamp+parseFloat($('#stamp'+i+'').text());
		total_sebi_fee=total_sebi_fee+parseFloat($('#sebi_fee'+i+'').text());
		total_net_buy_value=total_net_buy_value+parseFloat($('#net_buy_value'+i+'').text());
		total_net_sell_value=total_net_sell_value+parseFloat($('#net_sell_value'+i+'').text());
		if($('#search_company'+i+'').val()!='')
		{
			total_order +='<tr><td>'+ $('#search_company'+i+'').val() +'</td><td>'+ $('#quantity'+i+'').val() +'</td><td>'+ $('#buy_price'+i+'').val() +'</td><td>'+ $('#sell_price'+i+'').val() +'</td><td>'+$('#delivery'+i+'').val()+'</td></tr>';
		}
	}
	$('#FooterBrokerage').text(parseFloat(total_sum_brokerage).toFixed(0));
	$('#brokerage').text(parseFloat(total_sum_brokerage).toFixed(0));
	$('#brokerage_1').text(parseFloat(total_sum_brokerage).toFixed(0));
	$('#FooterBrokerageTaxes').text(parseFloat(total_sum_tax).toFixed(0));
	$('#total_tax').text(parseFloat(total_sum_tax).toFixed(0));
	$('#FooterPnl').text(parseFloat(total_pnl).toFixed(0));
	$('#pnl').text(parseFloat(total_pnl).toFixed(0));
	$('#othertaxes').text(parseFloat(other_charges).toFixed(0));
	$('#breakeven').text(parseFloat(total_breakeven).toFixed(0));
	$('#breakeven_1').text(parseFloat(total_breakeven).toFixed(0));
	$('#stt_ctt').text(parseFloat(total_stt_ctt).toFixed(0));
	$('#t_charges').text(parseFloat(total_t_charges).toFixed(0));
	$('#gst').text(parseFloat(total_gst).toFixed(0));
	$('#stamp').text(parseFloat(total_stamp).toFixed(0));
	$('#sebi_fee').text(parseFloat(total_sebi_fee).toFixed(0));
	$('#total_order').replaceWith('<tbody id="total_order">'+total_order+'</tbody>');
	$('#net_buy_value').text('â‚¹ '+parseFloat(total_net_buy_value).toFixed(0));
	$('#net_sell_value').text('â‚¹ '+parseFloat(total_net_sell_value).toFixed(0));
}

function closeid05()
{
	$('#id05').hide();
}

function view_btn()
{
	$('#id05').show();
}

function select_tab(a,e)
{
	var i, tablinks;
	tablinks = document.getElementsByClassName("link");
	for (i = 0; i < tablinks.length; i++) {
		tablinks[i].className = "link non_active";
	}
	$(e).addClass('active');
    $(e).removeClass('non_active');

    var j, tabs;
	tabs = document.getElementsByClassName("tabss");

	for (j = 0; j < tabs.length; j++) {
		tabs[j].className = "tabss tab-pane";
	}
	$("#"+a+"").addClass('active');
    $("#"+a+"").removeClass('tab-pane');
}

/*================= f&o function sart =================*/

function fo_futures(num)
{
	var fo_fut_hidden=document.getElementById('select_fo_check').getAttribute('ffi');
	var fo_futures_buy=$('#fo_futures_buy'+num+'').val();
	var fo_futures_sell=$('#fo_futures_sell'+num+'').val();
	var fo_futures_qty=$('#fo_futures_qty'+num+'').val();
	if(fo_futures_qty=='' || fo_futures_sell=='' || fo_futures_buy=='')
	{
		console.log('ddd')
		$('#fut_turn'+num+'').text(0);
		$('#fut_brokerage'+num+'').text(0);
		$('#fut_stt'+num+'').text(0);
		$('#fut_etc'+num+'').text(0);
		$('#fut_cc'+num+'').text(0);
		$('#fut_gst'+num+'').text(0);
		$('#sebi_fut'+num+'').text(0);
		$('#stamp_duty_fut'+num+'').text(0);
		$('#fut_total'+num+'').text(0);
		$('#fut_breakeven'+num+'').text(0);
		$('#fut_pnl'+num+'').text(0);
		$('#fut_pnl'+num+'').removeClass('red_color');
		$('#fut_pnl'+num+'').addClass('green_color');
	}
	else
	{
		var toal_fut_sell=fo_futures_qty*fo_futures_sell;
		var toal_fut_buy=fo_futures_qty*fo_futures_buy;
		var turnover=toal_fut_sell+toal_fut_buy;
		$('#fut_turn'+num+'').text(turnover);

		var fut_brokerage=(0.02 / 100)*turnover;
		$('#fut_brokerage'+num+'').text(parseFloat(fut_brokerage).toFixed(0));

		var fut_stt_ctt=(0.01 / 100) * toal_fut_sell;
		$('#fut_stt'+num+'').text(parseInt(fut_stt_ctt));

		var fut_t_charges_sel=(0.002 / 100) * toal_fut_sell;
		var fut_t_charges_buy=(0.002 / 100) * toal_fut_buy;
		var fut_t_charges=fut_t_charges_sel+fut_t_charges_buy;
		$('#fut_etc'+num+'').text(parseFloat(fut_t_charges).toFixed(0));

		var fut_gst=(18 / 100) * (fut_brokerage+fut_t_charges)
		$('#fut_gst'+num+'').text(parseFloat(fut_gst).toFixed(0));

		var fut_cc=(50 / 10000000)*turnover;
		$('#fut_cc'+num+'').text(parseFloat(fut_cc).toFixed(0));

		var fut_stamp=(0.002 / 100) * toal_fut_buy;
		$('#stamp_duty_fut'+num+'').text(parseFloat(fut_stamp).toFixed(0));

		var fut_sebi_fee=(turnover)*(10/10000000);
		$('#sebi_fut'+num+'').text(parseFloat(fut_sebi_fee).toFixed(0));

		var fut_othertaxes=fut_sebi_fee+fut_stamp+fut_gst+fut_t_charges+parseInt(fut_stt_ctt)+fut_cc;

		var fut_total_tax=fut_brokerage + fut_othertaxes;
		$('#fut_total'+num+'').text(parseFloat(fut_total_tax).toFixed(0));

		var fut_breakeven=((toal_fut_buy+fut_total_tax)/fo_futures_qty)-fo_futures_buy;
		$('#fut_breakeven'+num+'').text(parseFloat(fut_breakeven).toFixed(0));

		var fut_pnl=toal_fut_sell - toal_fut_buy - fut_total_tax;
		$('#fut_pnl'+num+'').text(parseFloat(fut_pnl).toFixed(0));

		if(fut_pnl < 0)
		{
			$('#fut_pnl'+num+'').addClass('red_color');			
			$('#fut_pnl'+num+'').removeClass('green_color');
		}
		else
		{
			$('#fut_pnl'+num+'').removeClass('red_color');
			$('#fut_pnl'+num+'').addClass('green_color');
		}		
	}
}

function fo_options(num)
{
	var fo_opt_hidden=document.getElementById('select_fo_check').getAttribute('coi');
	var fo_options_buy=$('#fo_options_buy'+num+'').val();
	var fo_options_sell=$('#fo_options_sell'+num+'').val();
	var fo_options_qty=$('#fo_options_qty'+num+'').val();
	if(fo_options_qty=='' || fo_options_sell=='' || fo_options_buy=='')
	{
		console.log('ddd')
		$('#opt_turn'+num+'').text(0);
		$('#opt_brokerage'+num+'').text(0);
		$('#opt_stt'+num+'').text(0);
		$('#opt_etc'+num+'').text(0);
		$('#opt_cc'+num+'').text(0);
		$('#opt_gst'+num+'').text(0);
		$('#sebi_opt'+num+'').text(0);
		$('#stamp_duty_opt'+num+'').text(0);
		$('#opt_total'+num+'').text(0);
		$('#opt_breakeven'+num+'').text(0);
		$('#opt_pnl'+num+'').text(0);
		$('#opt_pnl'+num+'').removeClass('red_color');
		$('#opt_pnl'+num+'').addClass('green_color');
	}
	else
	{
		
		var toal_opt_sell=fo_options_qty*fo_options_sell;
		var toal_opt_buy=fo_options_qty*fo_options_buy;
		var turnover=toal_opt_sell+toal_opt_buy;
		$('#opt_turn'+num+'').text(turnover);

		var opt_brokerage=(1000/10000000)*turnover;
		$('#opt_brokerage'+num+'').text(parseFloat(opt_brokerage).toFixed(0));

		var opt_stt_ctt=(0.05 / 100) * toal_opt_sell;
		$('#opt_stt'+num+'').text(parseInt(opt_stt_ctt));

		var opt_t_charges_sel=(0.053 / 100) * toal_opt_sell;
		var opt_t_charges_buy=(0.053 / 100) * toal_opt_buy;
		var opt_t_charges=opt_t_charges_sel+opt_t_charges_buy;
		$('#opt_etc'+num+'').text(parseFloat(opt_t_charges).toFixed(0));

		var opt_gst=(18 / 100) * (opt_brokerage+opt_t_charges)
		$('#opt_gst'+num+'').text(parseFloat(opt_gst).toFixed(0));

		var opt_cc=(2000 / 10000000)*turnover;
		$('#opt_cc'+num+'').text(parseFloat(opt_cc).toFixed(0));

		var opt_stamp=(0.003 / 100) * toal_opt_buy;
		$('#stamp_duty_opt'+num+'').text(parseFloat(opt_stamp).toFixed(0));

		var opt_sebi_fee=(turnover)*(10/10000000);
		$('#sebi_opt'+num+'').text(parseFloat(opt_sebi_fee).toFixed(0));

		var opt_othertaxes=opt_sebi_fee+opt_stamp+opt_gst+opt_t_charges+parseInt(opt_stt_ctt)+opt_cc;

		console.log(opt_sebi_fee)

		var opt_total_tax=opt_brokerage + opt_othertaxes;
		$('#opt_total'+num+'').text(parseFloat(opt_total_tax).toFixed(0));

		var opt_breakeven=((toal_opt_buy+opt_total_tax)/fo_options_qty)-fo_options_buy;
		$('#opt_breakeven'+num+'').text(parseFloat(opt_breakeven).toFixed(0));

		var opt_pnl=toal_opt_sell - toal_opt_buy - opt_total_tax;
		$('#opt_pnl'+num+'').text(parseFloat(opt_pnl).toFixed(0));

		if(opt_pnl < 0)
		{
			$('#opt_pnl'+num+'').addClass('red_color');			
			$('#opt_pnl'+num+'').removeClass('green_color');
		}
		else
		{
			$('#opt_pnl'+num+'').removeClass('red_color');
			$('#opt_pnl'+num+'').addClass('green_color');
		}
	}
}

function fo_fut_check_box(a, e, num)
{
	var fo_futures_buy=$('#fo_futures_buy'+num+'').val();
	var fo_futures_sell=$('#fo_futures_sell'+num+'').val();
	var fo_futures_qty=$('#fo_futures_qty'+num+'').val();
	if(fo_futures_qty=='' || fo_futures_sell=='' || fo_futures_buy=='')
	{
		$('#delivery_radio'+num+'').val('intraday')
		$('#select_fo_check').attr('ffi','nse')
		$('#fut_turn'+num+'').text(0);
		$('#fut_brokerage'+num+'').text(0);
		$('#fut_stt'+num+'').text(0);
		$('#fut_etc'+num+'').text(0);
		$('#fut_cc'+num+'').text(0);
		$('#fut_gst'+num+'').text(0);
		$('#sebi_fut'+num+'').text(0);
		$('#stamp_duty_fut'+num+'').text(0);
		$('#fut_total'+num+'').text(0);
		$('#fut_breakeven'+num+'').text(0);
		$('#fut_pnl'+num+'').text(0);
		$('#fut_pnl'+num+'').removeClass('red_color');
		$('#fut_pnl'+num+'').addClass('green_color');
	}
	else
	{
		$('#delivery_radio'+num+'').val('intraday')
		$('#select_fo_check').attr('ffi','intraday')
		var toal_fut_sell=fo_futures_qty*fo_futures_sell;
		var toal_fut_buy=fo_futures_qty*fo_futures_buy;
		var turnover=toal_fut_sell+toal_fut_buy;
		$('#fut_turn'+num+'').text(turnover);

		var fut_brokerage=(0.02 / 100)*turnover;
		$('#fut_brokerage'+num+'').text(parseFloat(fut_brokerage).toFixed(0));

		var fut_stt_ctt=(0.01 / 100) * toal_fut_sell;
		$('#fut_stt'+num+'').text(parseInt(fut_stt_ctt));

		var fut_t_charges_sel=(0.002 / 100) * toal_fut_sell;
		var fut_t_charges_buy=(0.002 / 100) * toal_fut_buy;
		var fut_t_charges=fut_t_charges_sel+fut_t_charges_buy;
		$('#fut_etc'+num+'').text(parseFloat(fut_t_charges).toFixed(0));

		var fut_gst=(18 / 100) * (fut_brokerage+fut_t_charges)
		$('#fut_gst'+num+'').text(parseFloat(fut_gst).toFixed(0));

		var fut_cc=(50 / 10000000)*turnover;
		$('#fut_cc'+num+'').text(parseFloat(fut_cc).toFixed(0));

		var fut_stamp=(0.002 / 100) * toal_fut_buy;
		$('#stamp_duty_fut'+num+'').text(parseFloat(fut_stamp).toFixed(0));

		var fut_sebi_fee=(turnover)*(10/10000000);
		$('#sebi_fut'+num+'').text(parseFloat(fut_sebi_fee).toFixed(0));

		var fut_othertaxes=fut_sebi_fee+fut_stamp+fut_gst+fut_t_charges+parseInt(fut_stt_ctt)+fut_cc;

		var fut_total_tax=fut_brokerage + fut_othertaxes;
		$('#fut_total'+num+'').text(parseFloat(fut_total_tax).toFixed(0));

		var fut_breakeven=((toal_fut_buy+fut_total_tax)/fo_futures_qty)-fo_futures_buy;
		$('#fut_breakeven'+num+'').text(parseFloat(fut_breakeven).toFixed(0));

		var fut_pnl=toal_fut_sell - toal_fut_buy - fut_total_tax;
		$('#fut_pnl'+num+'').text(parseFloat(fut_pnl).toFixed(0));

		if(fut_pnl < 0)
		{
			$('#fut_pnl'+num+'').addClass('red_color');			
			$('#fut_pnl'+num+'').removeClass('green_color');
		}
		else
		{
			$('#fut_pnl'+num+'').removeClass('red_color');
			$('#fut_pnl'+num+'').addClass('green_color');
		}
	}
}

function fo_opt_check_box(a, e, num)
{
	var fo_options_buy=$('#fo_options_buy'+num+'').val();
	var fo_options_sell=$('#fo_options_sell'+num+'').val();
	var fo_options_qty=$('#fo_options_qty'+num+'').val();
	if(fo_options_qty=='' || fo_options_sell=='' || fo_options_buy=='')
	{
		$('#delivery_opt_radio'+num+'').val('intraday')
		$('#select_fo_check').attr('foi','nse')
		$('#opt_turn'+num+'').text(0);
		$('#opt_brokerage'+num+'').text(0);
		$('#opt_stt'+num+'').text(0);
		$('#opt_etc'+num+'').text(0);
		$('#opt_cc'+num+'').text(0);
		$('#opt_gst'+num+'').text(0);
		$('#sebi_opt'+num+'').text(0);
		$('#stamp_duty_opt'+num+'').text(0);
		$('#opt_total'+num+'').text(0);
		$('#opt_breakeven'+num+'').text(0);
		$('#opt_pnl'+num+'').text(0);
		$('#opt_pnl'+num+'').removeClass('red_color');
		$('#opt_pnl'+num+'').addClass('green_color');
	}
	else
	{
	
		$('#delivery_opt_radio'+num+'').val('intraday')
		$('#select_fo_check').attr('foi','intraday')
		var toal_opt_sell=fo_options_qty*fo_options_sell;
		var toal_opt_buy=fo_options_qty*fo_options_buy;
		var turnover=toal_opt_sell+toal_opt_buy;
		$('#opt_turn'+num+'').text(turnover);

		var opt_brokerage=(1000/10000000)*turnover;
		$('#opt_brokerage'+num+'').text(parseFloat(opt_brokerage).toFixed(0));

		var opt_stt_ctt=(0.05 / 100) * toal_opt_sell;
		$('#opt_stt'+num+'').text(parseInt(opt_stt_ctt));

		var opt_t_charges_sel=(0.053 / 100) * toal_opt_sell;
		var opt_t_charges_buy=(0.053 / 100) * toal_opt_buy;
		var opt_t_charges=opt_t_charges_sel+opt_t_charges_buy;
		$('#opt_etc'+num+'').text(parseFloat(opt_t_charges).toFixed(0));

		var opt_gst=(18 / 100) * (opt_brokerage+opt_t_charges)
		$('#opt_gst'+num+'').text(parseFloat(opt_gst).toFixed(0));

		var opt_cc=(2000 / 10000000)*turnover;
		$('#opt_cc'+num+'').text(parseFloat(opt_cc).toFixed(0));

		var opt_stamp=(0.003 / 100) * toal_opt_buy;
		$('#stamp_duty_opt'+num+'').text(parseFloat(opt_stamp).toFixed(0));

		var opt_sebi_fee=(turnover)*(10/10000000);
		$('#sebi_opt'+num+'').text(parseFloat(opt_sebi_fee).toFixed(0));

		var opt_othertaxes=opt_sebi_fee+opt_stamp+opt_gst+opt_t_charges+parseInt(opt_stt_ctt)+opt_cc;

		var opt_total_tax=opt_brokerage + opt_othertaxes;
		$('#opt_total'+num+'').text(parseFloat(opt_total_tax).toFixed(0));

		var opt_breakeven=((toal_opt_buy+opt_total_tax)/fo_options_qty)-fo_options_buy;
		$('#opt_breakeven'+num+'').text(parseFloat(opt_breakeven).toFixed(0));

		var opt_pnl=toal_opt_sell - toal_opt_buy - opt_total_tax;
		$('#opt_pnl'+num+'').text(parseFloat(opt_pnl).toFixed(0));

		if(opt_pnl < 0)
		{
			$('#opt_pnl'+num+'').addClass('red_color');			
			$('#opt_pnl'+num+'').removeClass('green_color');
		}
		else
		{
			$('#opt_pnl'+num+'').removeClass('red_color');
			$('#opt_pnl'+num+'').addClass('green_color');
		}
	}
}

/*================= f&o function end =================*/

/*================= currency function statrt =================*/

function curr_futures(num)
{
	var curr_fut_hidden=document.getElementById('select_curr_check').getAttribute('cfi');
	var curr_fut_buy=$('#curr_fut_buy'+num+'').val();
	var curr_fut_sell=$('#curr_fut_sell'+num+'').val();
	var curr_fut_qty=$('#curr_fut_qty'+num+'').val();
	if(curr_fut_qty=='' || curr_fut_sell=='' || curr_fut_buy=='')
	{
		console.log('ddd')
		$('#curr_fut_turn'+num+'').text(0);
		$('#curr_fut_brokerage'+num+'').text(0);
		$('#curr_fut_stt'+num+'').text(0);
		$('#curr_fut_etc'+num+'').text(0);
		$('#curr_fut_cc'+num+'').text(0);
		$('#curr_fut_gst'+num+'').text(0);
		$('#curr_sebi_fut'+num+'').text(0);
		$('#curr_stamp_duty_fut'+num+'').text(0);
		$('#curr_fut_total'+num+'').text(0);
		$('#curr_fut_breakeven'+num+'').text(0);
		$('#curr_fut_pnl'+num+'').text(0);
		$('#curr_fut_pnl'+num+'').removeClass('red_color');
		$('#curr_fut_pnl'+num+'').addClass('green_color');
	}
	else
	{
		var curr_toal_fut_sell=curr_fut_qty*curr_fut_sell;
		var curr_toal_fut_buy=curr_fut_qty*curr_fut_buy;
		var curr_turnover=curr_toal_fut_sell+curr_toal_fut_buy;
		$('#curr_fut_turn'+num+'').text(curr_turnover);

		var curr_fut_brokerage=(0.02 / 100)*curr_turnover;
		$('#curr_fut_brokerage'+num+'').text(parseFloat(curr_fut_brokerage).toFixed(0));

		var curr_fut_stt=(0.01 / 100) * curr_toal_fut_sell;
		$('#curr_fut_stt'+num+'').text(parseInt(curr_fut_stt));

		var curr_fut_t_charges_sel=(0.0009 / 100) * curr_toal_fut_sell;
		var curr_fut_t_charges_buy=(0.0009 / 100) * curr_toal_fut_buy;
		var curr_fut_t_charges=curr_fut_t_charges_sel+curr_fut_t_charges_buy;
		$('#curr_fut_etc'+num+'').text(parseFloat(curr_fut_t_charges).toFixed(0));

		var curr_fut_gst=(18 / 100) * (curr_fut_brokerage+curr_fut_t_charges)
		$('#curr_fut_gst'+num+'').text(parseFloat(curr_fut_gst).toFixed(0));

		var curr_fut_cc=(50 / 10000000)*curr_turnover;
		$('#curr_fut_cc'+num+'').text(parseFloat(curr_fut_cc).toFixed(0));

		var curr_fut_stamp=(0.002 / 100) * curr_toal_fut_buy;
		$('#curr_stamp_duty_fut'+num+'').text(parseFloat(curr_fut_stamp).toFixed(0));

		var curr_fut_sebi_fee=(curr_turnover)*(10/10000000);
		$('#curr_sebi_fut'+num+'').text(parseFloat(curr_fut_sebi_fee).toFixed(0));

		var curr_fut_othertaxes=curr_fut_sebi_fee+curr_fut_stamp+curr_fut_gst+curr_fut_t_charges+parseInt(curr_fut_stt)+curr_fut_cc;

		var curr_fut_total_tax=curr_fut_brokerage + curr_fut_othertaxes;
		$('#curr_fut_total'+num+'').text(parseFloat(curr_fut_total_tax).toFixed(0));

		var curr_fut_breakeven=((curr_toal_fut_buy+curr_fut_total_tax)/curr_fut_qty)-curr_fut_buy;
		$('#curr_fut_breakeven'+num+'').text(parseFloat(curr_fut_breakeven).toFixed(0));

		var curr_fut_pnl=curr_toal_fut_sell - curr_toal_fut_buy - curr_fut_total_tax;
		$('#curr_fut_pnl'+num+'').text(parseFloat(curr_fut_pnl).toFixed(0));

		if(curr_fut_pnl < 0)
		{
			$('#curr_fut_pnl'+num+'').addClass('red_color');			
			$('#curr_fut_pnl'+num+'').removeClass('green_color');
		}
		else
		{
			$('#curr_fut_pnl'+num+'').removeClass('red_color');
			$('#curr_fut_pnl'+num+'').addClass('green_color');
		}
	}
}

function curr_options(num)
{

	var curr_opt_hidden=document.getElementById('select_curr_check').getAttribute('coi');
	//var curr_opt_strike=$('#curr_opt_strike'+num+'').val();
	var curr_opt_buy=$('#curr_opt_buy'+num+'').val();
	var curr_opt_sell=$('#curr_opt_sell'+num+'').val();
	var curr_opt_qty=$('#curr_opt_qty'+num+'').val();

	if(curr_opt_qty=='' || curr_opt_sell=='' || curr_opt_buy=='')
	{
		console.log('ddd')
		$('#curr_opt_turn'+num+'').text(0);
		$('#curr_opt_brokerage'+num+'').text(0);
		$('#curr_opt_stt'+num+'').text(0);
		$('#curr_opt_etc'+num+'').text(0);
		$('#curr_opt_cc'+num+'').text(0);
		$('#curr_opt_gst'+num+'').text(0);
		$('#curr_sebi_opt'+num+'').text(0);
		$('#curr_stamp_duty_opt'+num+'').text(0);
		$('#curr_opt_total'+num+'').text(0);
		$('#curr_opt_breakeven'+num+'').text(0);
		$('#curr_opt_pnl'+num+'').text(0);
		$('#curr_opt_pnl'+num+'').removeClass('red_color');
		$('#curr_opt_pnl'+num+'').addClass('green_color');
	}
	else
	{
		var curr_toal_opt_sell=curr_opt_qty*curr_opt_sell;
		var curr_toal_opt_buy=curr_opt_qty*curr_opt_buy;
		var curr_turnover=curr_toal_opt_sell+curr_toal_opt_buy;
		$('#curr_opt_turn'+num+'').text(curr_turnover);

		var curr_opt_brokerage=(1000/10000000)*curr_turnover;
		$('#curr_opt_brokerage'+num+'').text(parseFloat(curr_opt_brokerage).toFixed(0));

		var curr_opt_stt=(0.05 / 100) * curr_toal_opt_sell;
		$('#curr_opt_stt'+num+'').text(parseInt(curr_opt_stt));

		var curr_opt_t_charges_sel=(0.035 / 100) * curr_toal_opt_sell;
		var curr_opt_t_charges_buy=(0.035 / 100) * curr_toal_opt_buy;
		var curr_opt_t_charges=curr_opt_t_charges_sel+curr_opt_t_charges_buy;
		$('#curr_opt_etc'+num+'').text(parseFloat(curr_opt_t_charges).toFixed(0));

		var curr_opt_gst=(18 / 100) * (curr_opt_brokerage+curr_opt_t_charges)
		$('#curr_opt_gst'+num+'').text(parseFloat(curr_opt_gst).toFixed(0));

		var curr_opt_cc=(2000 / 10000000)*curr_turnover;
		$('#curr_opt_cc'+num+'').text(parseFloat(curr_opt_cc).toFixed(0));

		var curr_opt_stamp=(0.003 / 100) * curr_toal_opt_buy;
		$('#curr_stamp_duty_opt'+num+'').text(parseFloat(curr_opt_stamp).toFixed(0));

		var curr_opt_sebi_fee=(curr_turnover)*(10/10000000);
		$('#curr_sebi_opt'+num+'').text(parseFloat(curr_opt_sebi_fee).toFixed(0));

		var curr_opt_othertaxes=curr_opt_sebi_fee+curr_opt_stamp+curr_opt_gst+curr_opt_t_charges+parseInt(curr_opt_stt)+curr_opt_cc;

		//console.log(curr_opt_sebi_fee+'\n'+curr_opt_stamp+'\n'+curr_opt_gst+'\n'+curr_opt_t_charges+'\n'+curr_opt_stt+'\n'+curr_opt_cc)
		var curr_opt_total_tax=curr_opt_brokerage + curr_opt_othertaxes;
		$('#curr_opt_total'+num+'').text(parseFloat(curr_opt_total_tax).toFixed(0));

		var curr_opt_breakeven=((curr_toal_opt_sell+curr_opt_total_tax)/curr_opt_qty)-curr_opt_buy;
		$('#curr_opt_breakeven'+num+'').text(parseFloat(curr_opt_breakeven).toFixed(0));
		//console.log(curr_opt_breakeven)

		var curr_opt_pnl=curr_toal_opt_sell - curr_toal_opt_buy - curr_opt_total_tax;
		$('#curr_opt_pnl'+num+'').text(parseFloat(curr_opt_pnl).toFixed(0));

		if(curr_opt_pnl < 0)
		{
			$('#curr_opt_pnl'+num+'').addClass('red_color');			
			$('#curr_opt_pnl'+num+'').removeClass('green_color');
		}
		else
		{
			$('#curr_opt_pnl'+num+'').removeClass('red_color');
			$('#curr_opt_pnl'+num+'').addClass('green_color');
		}
	}
}

function curr_fut_check_box(a, e, num)
{
	var curr_fut_buy=$('#curr_fut_buy'+num+'').val();
	var curr_fut_sell=$('#curr_fut_sell'+num+'').val();
	var curr_fut_qty=$('#curr_fut_qty'+num+'').val();
	if(curr_fut_qty=='' || curr_fut_sell=='' || curr_fut_buy=='')
	{
		$('#currency_delivery_radio'+num+'').val('intraday')
		$('#select_curr_check').attr('cfi','nse')
		$('#curr_fut_turn'+num+'').text(0);
		$('#curr_fut_brokerage'+num+'').text(0);
		$('#curr_fut_stt'+num+'').text(0);
		$('#curr_fut_etc'+num+'').text(0);
		$('#curr_fut_cc'+num+'').text(0);
		$('#curr_fut_gst'+num+'').text(0);
		$('#curr_sebi_fut'+num+'').text(0);
		$('#curr_stamp_duty_fut'+num+'').text(0);
		$('#curr_fut_total'+num+'').text(0);
		$('#curr_fut_breakeven'+num+'').text(0);
		$('#curr_fut_pnl'+num+'').text(0);
		$('#curr_fut_pnl'+num+'').removeClass('red_color');
		$('#curr_fut_pnl'+num+'').addClass('green_color');
	}
	else
	{	
		$('#currency_delivery_radio'+num+'').val('intraday')
		$('#select_curr_check').attr('cfi','intraday')
		var curr_toal_fut_sell=curr_fut_qty*curr_fut_sell;
		var curr_toal_fut_buy=curr_fut_qty*curr_fut_buy;
		var curr_turnover=curr_toal_fut_sell+curr_toal_fut_buy;
		$('#curr_fut_turn'+num+'').text(curr_turnover);

		var curr_fut_brokerage=(0.02 / 100)*curr_turnover;
		$('#curr_fut_brokerage'+num+'').text(parseFloat(curr_fut_brokerage).toFixed(0));

		var curr_fut_stt=(0.01 / 100) * curr_toal_fut_sell;
		$('#curr_fut_stt'+num+'').text(parseInt(curr_fut_stt));

		var curr_fut_t_charges_sel=(0.0009 / 100) * curr_toal_fut_sell;
		var curr_fut_t_charges_buy=(0.0009 / 100) * curr_toal_fut_buy;
		var curr_fut_t_charges=curr_fut_t_charges_sel+curr_fut_t_charges_buy;
		$('#curr_fut_etc'+num+'').text(parseFloat(curr_fut_t_charges).toFixed(0));

		var curr_fut_gst=(18 / 100) * (curr_fut_brokerage+curr_fut_t_charges)
		$('#curr_fut_gst'+num+'').text(parseFloat(curr_fut_gst).toFixed(0));

		var curr_fut_cc=(50 / 10000000)*curr_turnover;
		$('#curr_fut_cc'+num+'').text(parseFloat(curr_fut_cc).toFixed(0));

		var curr_fut_stamp=(0.002 / 100) * curr_toal_fut_buy;
		$('#curr_stamp_duty_fut'+num+'').text(parseFloat(curr_fut_stamp).toFixed(0));

		var curr_fut_sebi_fee=(curr_turnover)*(10/10000000);
		$('#curr_sebi_fut'+num+'').text(parseFloat(curr_fut_sebi_fee).toFixed(0));

		var curr_fut_othertaxes=curr_fut_sebi_fee+curr_fut_stamp+curr_fut_gst+curr_fut_t_charges+parseInt(curr_fut_stt)+curr_fut_cc;

		var curr_fut_total_tax=curr_fut_brokerage + curr_fut_othertaxes;
		$('#curr_fut_total'+num+'').text(parseFloat(curr_fut_total_tax).toFixed(0));

		var curr_fut_breakeven=((curr_toal_fut_buy+curr_fut_total_tax)/curr_fut_qty)-curr_fut_buy;
		$('#curr_fut_breakeven'+num+'').text(parseFloat(curr_fut_breakeven).toFixed(0));

		var curr_fut_pnl=curr_toal_fut_sell - curr_toal_fut_buy - curr_fut_total_tax;
		$('#curr_fut_pnl'+num+'').text(parseFloat(curr_fut_pnl).toFixed(0));

		if(curr_fut_pnl < 0)
		{
			$('#curr_fut_pnl'+num+'').addClass('red_color');			
			$('#curr_fut_pnl'+num+'').removeClass('green_color');
		}
		else
		{
			$('#curr_fut_pnl'+num+'').removeClass('red_color');
			$('#curr_fut_pnl'+num+'').addClass('green_color');
		}
	}
}

function curr_opt_check_box(a, e, num)
{
	//var curr_opt_strike=$('#curr_opt_strike'+num+'').val();
	var curr_opt_buy=$('#curr_opt_buy'+num+'').val();
	var curr_opt_sell=$('#curr_opt_sell'+num+'').val();
	var curr_opt_qty=$('#curr_opt_qty'+num+'').val();

	if(curr_opt_qty=='' || curr_opt_sell=='' || curr_opt_buy=='')
	{
		$('#currency_delivery_opt_radio'+num+'').val('intraday');
		$('#select_curr_check').attr('coi','nse');
		$('#curr_opt_turn'+num+'').text(0);
		$('#curr_opt_brokerage'+num+'').text(0);
		$('#curr_opt_stt'+num+'').text(0);
		$('#curr_opt_etc'+num+'').text(0);
		$('#curr_opt_cc'+num+'').text(0);
		$('#curr_opt_gst'+num+'').text(0);
		$('#curr_sebi_opt'+num+'').text(0);
		$('#curr_stamp_duty_opt'+num+'').text(0);
		$('#curr_opt_total'+num+'').text(0);
		$('#curr_opt_breakeven'+num+'').text(0);
		$('#curr_opt_pnl'+num+'').text(0);
		$('#curr_opt_pnl'+num+'').removeClass('red_color');
		$('#curr_opt_pnl'+num+'').addClass('green_color');
	}
	else
	{
		$('#currency_delivery_opt_radio'+num+'').val('intraday')
		$('#select_curr_check').attr('coi','intraday')
		var curr_toal_opt_sell=curr_opt_qty*curr_opt_sell;
		var curr_toal_opt_buy=curr_opt_qty*curr_opt_buy;
		var curr_turnover=curr_toal_opt_sell+curr_toal_opt_buy;
		$('#curr_opt_turn'+num+'').text(curr_turnover);

		var curr_opt_brokerage=(1000/10000000)*curr_turnover;
		$('#curr_opt_brokerage'+num+'').text(parseFloat(curr_opt_brokerage).toFixed(0));

		var curr_opt_stt=(0.05 / 100) * curr_toal_opt_sell;
		$('#curr_opt_stt'+num+'').text(parseInt(curr_opt_stt));

		var curr_opt_t_charges_sel=(0.035 / 100) * curr_toal_opt_sell;
		var curr_opt_t_charges_buy=(0.035 / 100) * curr_toal_opt_buy;
		var curr_opt_t_charges=curr_opt_t_charges_sel+curr_opt_t_charges_buy;
		$('#curr_opt_etc'+num+'').text(parseFloat(curr_opt_t_charges).toFixed(0));

		var curr_opt_gst=(18 / 100) * (curr_opt_brokerage+curr_opt_t_charges)
		$('#curr_opt_gst'+num+'').text(parseFloat(curr_opt_gst).toFixed(0));

		var curr_opt_cc=(2000 / 10000000)*curr_turnover;
		$('#curr_opt_cc'+num+'').text(parseFloat(curr_opt_cc).toFixed(0));

		var curr_opt_stamp=(0.003 / 100) * curr_toal_opt_buy;
		$('#curr_stamp_duty_opt'+num+'').text(parseFloat(curr_opt_stamp).toFixed(0));

		var curr_opt_sebi_fee=(curr_turnover)*(10/10000000);
		$('#curr_sebi_opt'+num+'').text(parseFloat(curr_opt_sebi_fee).toFixed(0));

		var curr_opt_othertaxes=curr_opt_sebi_fee+curr_opt_stamp+curr_opt_gst+curr_opt_t_charges+parseInt(curr_opt_stt)+curr_opt_cc;

		var curr_opt_total_tax=curr_opt_brokerage + curr_opt_othertaxes;
		$('#curr_opt_total'+num+'').text(parseFloat(curr_opt_total_tax).toFixed(0));

		var curr_opt_breakeven=((curr_toal_opt_buy+curr_opt_total_tax)/curr_opt_qty)-curr_opt_buy;
		$('#curr_opt_breakeven'+num+'').text(parseFloat(curr_opt_breakeven).toFixed(0));

		var curr_opt_pnl=curr_toal_opt_sell - curr_toal_opt_buy - curr_opt_total_tax;
		$('#curr_opt_pnl'+num+'').text(parseFloat(curr_opt_pnl).toFixed(0));

		if(curr_opt_pnl < 0)
		{
			$('#curr_opt_pnl'+num+'').addClass('red_color');			
			$('#curr_opt_pnl'+num+'').removeClass('green_color');
		}
		else
		{
			$('#curr_opt_pnl'+num+'').removeClass('red_color');
			$('#curr_opt_pnl'+num+'').addClass('green_color');
		}
	}
}
/*================= corrency function end =================*/



/*================= commodity function statrt =================*/

function commodity_future_sel(el,num)
{
	/*console.log('kkk')
	console.log($(el).val())
	console.log(el.options[el.selectedIndex].getAttribute('bp'));*/
	$('#commo_fut_buy'+num+'').val(el.options[el.selectedIndex].getAttribute('bp'));
	$('#commo_fut_sell'+num+'').val(el.options[el.selectedIndex].getAttribute('sp'));
	var commo_fut_hidden=document.getElementById('select_comm_check').getAttribute('ccfi');

	var commo_fut_buy=$('#commo_fut_buy'+num+'').val();
	var commo_fut_sell=$('#commo_fut_sell'+num+'').val();
	var commo_fut_qty=$('#commo_fut_qty'+num+'').val();
	if(commo_fut_qty=='' || commo_fut_sell=='' || commo_fut_buy=='')
	{
		$('#commo_fut_turn'+num+'').text(0);
		$('#commo_fut_brokerage'+num+'').text(0);
		$('#commo_fut_stt'+num+'').text(0);
		$('#commo_fut_etc'+num+'').text(0);
		$('#commo_fut_cc'+num+'').text(0);
		$('#commo_fut_gst'+num+'').text(0);
		$('#commo_sebi_fut'+num+'').text(0);
		$('#commo_stamp_duty_fut'+num+'').text(0);
		$('#commo_fut_total'+num+'').text(0);
		$('#commo_fut_breakeven'+num+'').text(0);
		$('#commo_fut_pnl'+num+'').text(0);
	}
	else
	{
		if(commo_fut_hidden=='intraday')
		{
			var commo_toal_fut_sell=commo_fut_qty*commo_fut_sell;
			var commo_toal_fut_buy=commo_fut_qty*commo_fut_buy;
			var commo_turnover=commo_toal_fut_sell+commo_toal_fut_buy;
			$('#commo_fut_turn'+num+'').text(commo_turnover);

			var commo_fut_brokerage=(20 / 100)*commo_turnover;
			$('#commo_fut_brokerage'+num+'').text(parseFloat(commo_fut_brokerage).toFixed(0));

			var commo_fut_stt=(0.05 / 100) * commo_toal_fut_sell;
			$('#commo_fut_stt'+num+'').text(parseInt(commo_fut_stt));

			var commo_fut_t_charges_sel=(0 / 100) * commo_toal_fut_sell;
			var commo_fut_t_charges_buy=(0 / 100) * commo_toal_fut_buy;
			var commo_fut_t_charges=commo_fut_t_charges_sel+commo_fut_t_charges_buy;
			$('#commo_fut_etc'+num+'').text(parseFloat(commo_fut_t_charges).toFixed(0));

			var commo_fut_gst=(18 / 100) * (commo_fut_brokerage+commo_fut_t_charges)
			$('#commo_fut_gst'+num+'').text(parseFloat(commo_fut_gst).toFixed(0));

			var commo_fut_cc=parseFloat($('#commo_fut_cc'+num+'').text())

			var commo_fut_stamp=(0.002 / 100) * commo_toal_fut_buy;
			$('#commo_stamp_duty_fut'+num+'').text(parseFloat(commo_fut_stamp).toFixed(0));

			var commo_fut_sebi_fee=(commo_turnover)*(10/10000000);
			$('#commo_sebi_fut'+num+'').text(parseFloat(commo_fut_sebi_fee).toFixed(0));

			var commo_fut_othertaxes=commo_fut_sebi_fee+commo_fut_stamp+commo_fut_gst+commo_fut_t_charges+commo_fut_cc+parseInt(commo_fut_stt);

			var commo_fut_total_tax=commo_fut_brokerage + commo_fut_othertaxes;
			$('#commo_fut_total'+num+'').text(parseFloat(commo_fut_total_tax).toFixed(0));

			var commo_fut_breakeven=((commo_toal_fut_buy+commo_fut_total_tax)/commo_fut_qty)-commo_fut_buy;
			$('#commo_fut_breakeven'+num+'').text(parseFloat(commo_fut_breakeven).toFixed(0));

			var commo_fut_pnl=commo_toal_fut_sell - commo_toal_fut_buy - commo_fut_total_tax;
			$('#commo_fut_pnl'+num+'').text(parseFloat(commo_fut_pnl).toFixed(0));

			if(commo_fut_pnl < 0)
			{
				$('#commo_fut_pnl'+num+'').addClass('red_color');			
				$('#commo_fut_pnl'+num+'').removeClass('green_color');
			}
			else
			{
				$('#commo_fut_pnl'+num+'').removeClass('red_color');
				$('#commo_fut_pnl'+num+'').addClass('green_color');
			}
		}
		else
		{
			var commo_toal_fut_sell=commo_fut_qty*commo_fut_sell;
			var commo_toal_fut_buy=commo_fut_qty*commo_fut_buy;
			var commo_turnover=commo_toal_fut_sell+commo_toal_fut_buy;
			$('#commo_fut_turn'+num+'').text(commo_turnover);

			var commo_fut_brokerage=(0 / 100)*commo_turnover;
			$('#commo_fut_brokerage'+num+'').text(parseFloat(commo_fut_brokerage).toFixed(0));

			var commo_fut_stt=(0.05 / 100) * commo_toal_fut_sell;
			$('#commo_fut_stt'+num+'').text(parseInt(commo_fut_stt));

			var commo_fut_t_charges_sel=(0 / 100) * commo_toal_fut_sell;
			var commo_fut_t_charges_buy=(0 / 100) * commo_toal_fut_buy;
			var commo_fut_t_charges=commo_fut_t_charges_sel+commo_fut_t_charges_buy;
			$('#commo_fut_etc'+num+'').text(parseFloat(commo_fut_t_charges).toFixed(0));

			var commo_fut_gst=(18 / 100) * (commo_fut_brokerage+commo_fut_t_charges)
			$('#commo_fut_gst'+num+'').text(parseFloat(commo_fut_gst).toFixed(0));

			var commo_fut_cc=parseFloat($('#commo_fut_cc'+num+'').text())

			var commo_fut_stamp=(0.002 / 100) * commo_toal_fut_buy;
			$('#commo_stamp_duty_fut'+num+'').text(parseFloat(commo_fut_stamp).toFixed(0));

			var commo_fut_sebi_fee=(commo_turnover)*(10/10000000);
			$('#commo_sebi_fut'+num+'').text(parseFloat(commo_fut_sebi_fee).toFixed(0));

			var commo_fut_othertaxes=commo_fut_sebi_fee+commo_fut_stamp+commo_fut_gst+commo_fut_t_charges+commo_fut_cc+parseInt(commo_fut_stt);

			var commo_fut_total_tax=commo_fut_brokerage + commo_fut_othertaxes;
			$('#commo_fut_total'+num+'').text(parseFloat(commo_fut_total_tax).toFixed(0));

			var commo_fut_breakeven=((commo_toal_fut_buy+commo_fut_total_tax)/commo_fut_qty)-commo_fut_buy;
			$('#commo_fut_breakeven'+num+'').text(parseFloat(commo_fut_breakeven).toFixed(0));

			var commo_fut_pnl=commo_toal_fut_sell - commo_toal_fut_buy - commo_fut_total_tax;
			$('#commo_fut_pnl'+num+'').text(parseFloat(commo_fut_pnl).toFixed(0));

			if(commo_fut_pnl < 0)
			{
				$('#commo_fut_pnl'+num+'').addClass('red_color');			
				$('#commo_fut_pnl'+num+'').removeClass('green_color');
			}
			else
			{
				$('#commo_fut_pnl'+num+'').removeClass('red_color');
				$('#commo_fut_pnl'+num+'').addClass('green_color');
			}
		}
	}
}

function commodity_options_sel(el,num)
{
	/*console.log('kkk')
	console.log($(el).val())
	console.log(el.options[el.selectedIndex].getAttribute('srp'));*/
	var commo_opt_hidden=document.getElementById('select_comm_check').getAttribute('ccoi');

	$('#commo_opt_strike'+num+'').val(el.options[el.selectedIndex].getAttribute('srp'));
	$('#commo_opt_buy'+num+'').val(el.options[el.selectedIndex].getAttribute('bp'));
	$('#commo_opt_sell'+num+'').val(el.options[el.selectedIndex].getAttribute('sp'));


	var commo_opt_strike=$('#commo_opt_strike'+num+'').val();
	var commo_opt_buy=$('#commo_opt_buy'+num+'').val();
	var commo_opt_sell=$('#commo_opt_sell'+num+'').val();
	var commo_opt_qty=$('#commo_opt_qty'+num+'').val();
	if(commo_opt_qty=='' || commo_opt_sell=='' || commo_opt_buy=='' || commo_opt_strike=='')
	{
		$('#commo_opt_turn'+num+'').text(0);
		$('#commo_opt_brokerage'+num+'').text(0);
		$('#commo_opt_stt'+num+'').text(0);
		$('#commo_opt_etc'+num+'').text(0);
		$('#commo_opt_cc'+num+'').text(0);
		$('#commo_opt_gst'+num+'').text(0);
		$('#commo_sebi_opt'+num+'').text(0);
		$('#commo_stamp_duty_opt'+num+'').text(0);
		$('#commo_opt_total'+num+'').text(0);
		$('#commo_opt_breakeven'+num+'').text(0);
		$('#commo_opt_pnl'+num+'').text(0);
		$('#commo_opt_pnl'+num+'').removeClass('red_color');
		$('#commo_opt_pnl'+num+'').addClass('green_color');
	}
	else
	{
		if(commo_opt_hidden=='intraday')
		{
			var commo_toal_opt_sell=commo_opt_qty*commo_opt_sell;
			var commo_toal_opt_buy=commo_opt_qty*commo_opt_buy;
			var commo_turnover=commo_toal_opt_sell+commo_toal_opt_buy;
			$('#commo_opt_turn'+num+'').text(commo_turnover);

			var commo_opt_brokerage=(20 / 100)*commo_turnover;
			$('#commo_opt_brokerage'+num+'').text(parseFloat(commo_opt_brokerage).toFixed(0));

			var commo_opt_stt=(0.05 / 100) * commo_toal_opt_sell;
			$('#commo_opt_stt'+num+'').text(parseInt(commo_opt_stt));

			var commo_opt_t_charges_sel=(0 / 100) * commo_toal_opt_sell;
			var commo_opt_t_charges_buy=(0 / 100) * commo_toal_opt_buy;
			var commo_opt_t_charges=commo_opt_t_charges_sel+commo_opt_t_charges_buy;
			$('#commo_opt_etc'+num+'').text(parseFloat(commo_opt_t_charges).toFixed(0));

			var commo_opt_gst=(18 / 100) * (commo_opt_brokerage+commo_opt_t_charges)
			$('#commo_opt_gst'+num+'').text(parseFloat(commo_opt_gst).toFixed(0));

			var commo_opt_cc=parseFloat($('#commo_opt_cc'+num+'').text())

			var commo_opt_stamp=(0.003 / 100) * commo_toal_opt_buy;
			$('#commo_stamp_duty_opt'+num+'').text(parseFloat(commo_opt_stamp).toFixed(0));

			var commo_opt_sebi_fee=(commo_turnover)*(10/10000000);
			$('#commo_sebi_opt'+num+'').text(parseFloat(commo_opt_sebi_fee).toFixed(0));

			var commo_opt_othertaxes=commo_opt_sebi_fee+commo_opt_stamp+commo_opt_gst+commo_opt_t_charges+commo_opt_cc+parseInt(commo_opt_stt);

			var commo_opt_total_tax=commo_opt_brokerage + commo_opt_othertaxes;
			$('#commo_opt_total'+num+'').text(parseFloat(commo_opt_total_tax).toFixed(0));

			var commo_opt_breakeven=((commo_toal_opt_buy+commo_opt_total_tax)/commo_opt_qty)-commo_opt_buy;
			$('#commo_opt_breakeven'+num+'').text(parseFloat(commo_opt_breakeven).toFixed(0));

			var commo_opt_pnl=commo_toal_opt_sell - commo_toal_opt_buy - commo_opt_total_tax;
			$('#commo_opt_pnl'+num+'').text(parseFloat(commo_opt_pnl).toFixed(0));

			if(commo_opt_pnl < 0)
			{
				$('#commo_opt_pnl'+num+'').addClass('red_color');			
				$('#commo_opt_pnl'+num+'').removeClass('green_color');
			}
			else
			{
				$('#commo_opt_pnl'+num+'').removeClass('red_color');
				$('#commo_opt_pnl'+num+'').addClass('green_color');
			}
		}
		else
		{
			var commo_toal_opt_sell=commo_opt_qty*commo_opt_sell;
			var commo_toal_opt_buy=commo_opt_qty*commo_opt_buy;
			var commo_turnover=commo_toal_opt_sell+commo_toal_opt_buy;
			$('#commo_opt_turn'+num+'').text(commo_turnover);

			var commo_opt_brokerage=(0 / 100)*commo_turnover;
			$('#commo_opt_brokerage'+num+'').text(parseFloat(commo_opt_brokerage).toFixed(0));

			var commo_opt_stt=(0.05 / 100) * commo_toal_opt_sell;
			$('#commo_opt_stt'+num+'').text(parseInt(commo_opt_stt));

			var commo_opt_t_charges_sel=(0 / 100) * commo_toal_opt_sell;
			var commo_opt_t_charges_buy=(0 / 100) * commo_toal_opt_buy;
			var commo_opt_t_charges=commo_opt_t_charges_sel+commo_opt_t_charges_buy;
			$('#commo_opt_etc'+num+'').text(parseFloat(commo_opt_t_charges).toFixed(0));

			var commo_opt_gst=(18 / 100) * (commo_opt_brokerage+commo_opt_t_charges)
			$('#commo_opt_gst'+num+'').text(parseFloat(commo_opt_gst).toFixed(0));

			var commo_opt_cc=parseFloat($('#commo_opt_cc'+num+'').text())

			var commo_opt_stamp=(0.003 / 100) * commo_toal_opt_buy;
			$('#commo_stamp_duty_opt'+num+'').text(parseFloat(commo_opt_stamp).toFixed(0));

			var commo_opt_sebi_fee=(commo_turnover)*(10/10000000);
			$('#commo_sebi_opt'+num+'').text(parseFloat(commo_opt_sebi_fee).toFixed(0));

			var commo_opt_othertaxes=commo_opt_sebi_fee+commo_opt_stamp+commo_opt_gst+commo_opt_t_charges+commo_opt_cc+parseInt(commo_opt_stt);

			var commo_opt_total_tax=commo_opt_brokerage + commo_opt_othertaxes;
			$('#commo_opt_total'+num+'').text(parseFloat(commo_opt_total_tax).toFixed(0));

			var commo_opt_breakeven=((commo_toal_opt_buy+commo_opt_total_tax)/commo_opt_qty)-commo_opt_buy;
			$('#commo_opt_breakeven'+num+'').text(parseFloat(commo_opt_breakeven).toFixed(0));

			var commo_opt_pnl=commo_toal_opt_sell - commo_toal_opt_buy - commo_opt_total_tax;
			$('#commo_opt_pnl'+num+'').text(parseFloat(commo_opt_pnl).toFixed(0));

			if(commo_opt_pnl < 0)
			{
				$('#commo_opt_pnl'+num+'').addClass('red_color');			
				$('#commo_opt_pnl'+num+'').removeClass('green_color');
			}
			else
			{
				$('#commo_opt_pnl'+num+'').removeClass('red_color');
				$('#commo_opt_pnl'+num+'').addClass('green_color');
			}
		}
	}
}

function commo_fut_check_box(a, e, num)
{
	var commo_fut_buy=$('#commo_fut_buy'+num+'').val();
	var commo_fut_sell=$('#commo_fut_sell'+num+'').val();
	var commo_fut_qty=$('#commo_fut_qty'+num+'').val();
	if(commo_fut_qty=='' || commo_fut_sell=='' || commo_fut_buy=='')
	{
		if(a=='intraday')
		{
			$('#commodity_delivery_radio'+num+'').val('intraday')
			$('#select_comm_check').attr('ccfi','intraday')
		}
		else
		{
			$('#commodity_delivery_radio'+num+'').val('delivery')
			$('#select_comm_check').attr('ccfi','delivery')
		}
		$('#commo_fut_turn'+num+'').text(0);
		$('#commo_fut_brokerage'+num+'').text(0);
		$('#commo_fut_stt'+num+'').text(0);
		$('#commo_fut_etc'+num+'').text(0);
		$('#commo_fut_cc'+num+'').text(0);
		$('#commo_fut_gst'+num+'').text(0);
		$('#commo_sebi_fut'+num+'').text(0);
		$('#commo_stamp_duty_fut'+num+'').text(0);
		$('#commo_fut_total'+num+'').text(0);
		$('#commo_fut_breakeven'+num+'').text(0);
		$('#commo_fut_pnl'+num+'').text(0);
		$('#commo_fut_pnl'+num+'').removeClass('red_color');
		$('#commo_fut_pnl'+num+'').addClass('green_color');
	}
	else
	{
		if(a=='intraday')
		{
			$('#commodity_delivery_radio'+num+'').val('intraday')
			$('#select_comm_check').attr('ccfi','intraday')
			var commo_toal_fut_sell=commo_fut_qty*commo_fut_sell;
			var commo_toal_fut_buy=commo_fut_qty*commo_fut_buy;
			var commo_turnover=commo_toal_fut_sell+commo_toal_fut_buy;
			$('#commo_fut_turn'+num+'').text(commo_turnover);

			var commo_fut_brokerage=(20 / 100)*commo_turnover;
			$('#commo_fut_brokerage'+num+'').text(parseFloat(commo_fut_brokerage).toFixed(0));

			var commo_fut_stt=(0.05 / 100) * commo_toal_fut_sell;
			$('#commo_fut_stt'+num+'').text(parseInt(commo_fut_stt));

			var commo_fut_t_charges_sel=(0 / 100) * commo_toal_fut_sell;
			var commo_fut_t_charges_buy=(0 / 100) * commo_toal_fut_buy;
			var commo_fut_t_charges=commo_fut_t_charges_sel+commo_fut_t_charges_buy;
			$('#commo_fut_etc'+num+'').text(parseFloat(commo_fut_t_charges).toFixed(0));

			var commo_fut_gst=(18 / 100) * (commo_fut_brokerage+commo_fut_t_charges)
			$('#commo_fut_gst'+num+'').text(parseFloat(commo_fut_gst).toFixed(0));

			var commo_fut_cc=parseFloat($('#commo_fut_cc'+num+'').text())

			var commo_fut_stamp=(0.002 / 100) * commo_toal_fut_buy;
			$('#commo_stamp_duty_fut'+num+'').text(parseFloat(commo_fut_stamp).toFixed(0));

			var commo_fut_sebi_fee=(commo_turnover)*(10/10000000);
			$('#commo_sebi_fut'+num+'').text(parseFloat(commo_fut_sebi_fee).toFixed(0));

			var commo_fut_othertaxes=commo_fut_sebi_fee+commo_fut_stamp+commo_fut_gst+commo_fut_t_charges+commo_fut_cc+parseInt(commo_fut_stt);

			var commo_fut_total_tax=commo_fut_brokerage + commo_fut_othertaxes;
			$('#commo_fut_total'+num+'').text(parseFloat(commo_fut_total_tax).toFixed(0));

			var commo_fut_breakeven=((commo_toal_fut_buy+commo_fut_total_tax)/commo_fut_qty)-commo_fut_buy;
			$('#commo_fut_breakeven'+num+'').text(parseFloat(commo_fut_breakeven).toFixed(0));

			var commo_fut_pnl=commo_toal_fut_sell - commo_toal_fut_buy - commo_fut_total_tax;
			$('#commo_fut_pnl'+num+'').text(parseFloat(commo_fut_pnl).toFixed(0));

			if(commo_fut_pnl < 0)
			{
				$('#commo_fut_pnl'+num+'').addClass('red_color');			
				$('#commo_fut_pnl'+num+'').removeClass('green_color');
			}
			else
			{
				$('#commo_fut_pnl'+num+'').removeClass('red_color');
				$('#commo_fut_pnl'+num+'').addClass('green_color');
			}
		}
		else
		{
			$('#commodity_delivery_radio'+num+'').val('delivery')
			$('#select_comm_check').attr('ccfi','delivery')
			var commo_toal_fut_sell=commo_fut_qty*commo_fut_sell;
			var commo_toal_fut_buy=commo_fut_qty*commo_fut_buy;
			var commo_turnover=commo_toal_fut_sell+commo_toal_fut_buy;
			$('#commo_fut_turn'+num+'').text(commo_turnover);

			var commo_fut_brokerage=(0 / 100)*commo_turnover;
			$('#commo_fut_brokerage'+num+'').text(parseFloat(commo_fut_brokerage).toFixed(0));

			var commo_fut_stt=(0.05 / 100) * commo_toal_fut_sell;
			$('#commo_fut_stt'+num+'').text(parseInt(commo_fut_stt));

			var commo_fut_t_charges_sel=(0 / 100) * commo_toal_fut_sell;
			var commo_fut_t_charges_buy=(0 / 100) * commo_toal_fut_buy;
			var commo_fut_t_charges=commo_fut_t_charges_sel+commo_fut_t_charges_buy;
			$('#commo_fut_etc'+num+'').text(parseFloat(commo_fut_t_charges).toFixed(0));

			var commo_fut_gst=(18 / 100) * (commo_fut_brokerage+commo_fut_t_charges)
			$('#commo_fut_gst'+num+'').text(parseFloat(commo_fut_gst).toFixed(0));

			var commo_fut_cc=parseFloat($('#commo_fut_cc'+num+'').text())

			var commo_fut_stamp=(0.002 / 100) * commo_toal_fut_buy;
			$('#commo_stamp_duty_fut'+num+'').text(parseFloat(commo_fut_stamp).toFixed(0));

			var commo_fut_sebi_fee=(commo_turnover)*(10/10000000);
			$('#commo_sebi_fut'+num+'').text(parseFloat(commo_fut_sebi_fee).toFixed(0));

			var commo_fut_othertaxes=commo_fut_sebi_fee+commo_fut_stamp+commo_fut_gst+commo_fut_t_charges+commo_fut_cc+parseInt(commo_fut_stt);

			var commo_fut_total_tax=commo_fut_brokerage + commo_fut_othertaxes;
			$('#commo_fut_total'+num+'').text(parseFloat(commo_fut_total_tax).toFixed(0));

			var commo_fut_breakeven=((commo_toal_fut_buy+commo_fut_total_tax)/commo_fut_qty)-commo_fut_buy;
			$('#commo_fut_breakeven'+num+'').text(parseFloat(commo_fut_breakeven).toFixed(0));

			var commo_fut_pnl=commo_toal_fut_sell - commo_toal_fut_buy - commo_fut_total_tax;
			$('#commo_fut_pnl'+num+'').text(parseFloat(commo_fut_pnl).toFixed(0));

			if(commo_fut_pnl < 0)
			{
				$('#commo_fut_pnl'+num+'').addClass('red_color');			
				$('#commo_fut_pnl'+num+'').removeClass('green_color');
			}
			else
			{
				$('#commo_fut_pnl'+num+'').removeClass('red_color');
				$('#commo_fut_pnl'+num+'').addClass('green_color');
			}
		}
	}
}

function commo_opt_check_box(a, e, num)
{
	var commo_opt_strike=$('#commo_opt_strike'+num+'').val();
	var commo_opt_buy=$('#commo_opt_buy'+num+'').val();
	var commo_opt_sell=$('#commo_opt_sell'+num+'').val();
	var commo_opt_qty=$('#commo_opt_qty'+num+'').val();
	if(commo_opt_qty=='' || commo_opt_sell=='' || commo_opt_buy=='' || commo_opt_strike=='')
	{
		
		if(a=='intraday')
		{
			$('#commodity_delivery_opt_radio'+num+'').val('intraday')
			$('#select_comm_check').attr('ccoi','intraday')
		}
		else
		{
			$('#commodity_delivery_opt_radio'+num+'').val('delivery')
			$('#select_comm_check').attr('ccoi','delivery')
		}
		$('#commo_opt_turn'+num+'').text(0);
		$('#commo_opt_brokerage'+num+'').text(0);
		$('#commo_opt_stt'+num+'').text(0);
		$('#commo_opt_etc'+num+'').text(0);
		$('#commo_opt_cc'+num+'').text(0);
		$('#commo_opt_gst'+num+'').text(0);
		$('#commo_sebi_opt'+num+'').text(0);
		$('#commo_stamp_duty_opt'+num+'').text(0);
		$('#commo_opt_total'+num+'').text(0);
		$('#commo_opt_breakeven'+num+'').text(0);
		$('#commo_opt_pnl'+num+'').text(0);
		$('#commo_opt_pnl'+num+'').removeClass('red_color');
		$('#commo_opt_pnl'+num+'').addClass('green_color');
	}
	else
	{
		if(a=='intraday')
		{
			$('#commodity_delivery_opt_radio'+num+'').val('intraday')
			$('#select_comm_check').attr('ccoi','intraday')
			var commo_toal_opt_sell=commo_opt_qty*commo_opt_sell;
			var commo_toal_opt_buy=commo_opt_qty*commo_opt_buy;
			var commo_turnover=commo_toal_opt_sell+commo_toal_opt_buy;
			$('#commo_opt_turn'+num+'').text(commo_turnover);

			var commo_opt_brokerage=(20 / 100)*commo_turnover;
			$('#commo_opt_brokerage'+num+'').text(parseFloat(commo_opt_brokerage).toFixed(0));

			var commo_opt_stt=(0.05 / 100) * commo_toal_opt_sell;
			$('#commo_opt_stt'+num+'').text(parseInt(commo_opt_stt));

			var commo_opt_t_charges_sel=(0 / 100) * commo_toal_opt_sell;
			var commo_opt_t_charges_buy=(0 / 100) * commo_toal_opt_buy;
			var commo_opt_t_charges=commo_opt_t_charges_sel+commo_opt_t_charges_buy;
			$('#commo_opt_etc'+num+'').text(parseFloat(commo_opt_t_charges).toFixed(0));

			var commo_opt_gst=(18 / 100) * (commo_opt_brokerage+commo_opt_t_charges)
			$('#commo_opt_gst'+num+'').text(parseFloat(commo_opt_gst).toFixed(0));

			var commo_opt_cc=parseFloat($('#commo_opt_cc'+num+'').text())

			var commo_opt_stamp=(0.003 / 100) * commo_toal_opt_buy;
			$('#commo_stamp_duty_opt'+num+'').text(parseFloat(commo_opt_stamp).toFixed(0));

			var commo_opt_sebi_fee=(commo_turnover)*(10/10000000);
			$('#commo_sebi_opt'+num+'').text(parseFloat(commo_opt_sebi_fee).toFixed(0));

			var commo_opt_othertaxes=commo_opt_sebi_fee+commo_opt_stamp+commo_opt_gst+commo_opt_t_charges+commo_opt_cc+parseInt(commo_opt_stt);

			var commo_opt_total_tax=commo_opt_brokerage + commo_opt_othertaxes;
			$('#commo_opt_total'+num+'').text(parseFloat(commo_opt_total_tax).toFixed(0));

			var commo_opt_breakeven=((commo_toal_opt_buy+commo_opt_total_tax)/commo_opt_qty)-commo_opt_buy;
			$('#commo_opt_breakeven'+num+'').text(parseFloat(commo_opt_breakeven).toFixed(0));

			var commo_opt_pnl=commo_toal_opt_sell - commo_toal_opt_buy - commo_opt_total_tax;
			$('#commo_opt_pnl'+num+'').text(parseFloat(commo_opt_pnl).toFixed(0));

			if(commo_opt_pnl < 0)
			{
				$('#commo_opt_pnl'+num+'').addClass('red_color');			
				$('#commo_opt_pnl'+num+'').removeClass('green_color');
			}
			else
			{
				$('#commo_opt_pnl'+num+'').removeClass('red_color');
				$('#commo_opt_pnl'+num+'').addClass('green_color');
			}
		}
		else
		{
			$('#commodity_delivery_opt_radio'+num+'').val('delivery')
			$('#select_comm_check').attr('ccoi','delivery')
			var commo_toal_opt_sell=commo_opt_qty*commo_opt_sell;
			var commo_toal_opt_buy=commo_opt_qty*commo_opt_buy;
			var commo_turnover=commo_toal_opt_sell+commo_toal_opt_buy;
			$('#commo_opt_turn'+num+'').text(commo_turnover);

			var commo_opt_brokerage=(0 / 100)*commo_turnover;
			$('#commo_opt_brokerage'+num+'').text(parseFloat(commo_opt_brokerage).toFixed(0));

			var commo_opt_stt=(0.05 / 100) * commo_toal_opt_sell;
			$('#commo_opt_stt'+num+'').text(parseInt(commo_opt_stt));

			var commo_opt_t_charges_sel=(0 / 100) * commo_toal_opt_sell;
			var commo_opt_t_charges_buy=(0 / 100) * commo_toal_opt_buy;
			var commo_opt_t_charges=commo_opt_t_charges_sel+commo_opt_t_charges_buy;
			$('#commo_opt_etc'+num+'').text(parseFloat(commo_opt_t_charges).toFixed(0));

			var commo_opt_gst=(18 / 100) * (commo_opt_brokerage+commo_opt_t_charges)
			$('#commo_opt_gst'+num+'').text(parseFloat(commo_opt_gst).toFixed(0));

			var commo_opt_cc=parseFloat($('#commo_opt_cc'+num+'').text())

			var commo_opt_stamp=(0.003 / 100) * commo_toal_opt_buy;
			$('#commo_stamp_duty_opt'+num+'').text(parseFloat(commo_opt_stamp).toFixed(0));

			var commo_opt_sebi_fee=(commo_turnover)*(10/10000000);
			$('#commo_sebi_opt'+num+'').text(parseFloat(commo_opt_sebi_fee).toFixed(0));

			var commo_opt_othertaxes=commo_opt_sebi_fee+commo_opt_stamp+commo_opt_gst+commo_opt_t_charges+commo_opt_cc+parseInt(commo_opt_stt);

			var commo_opt_total_tax=commo_opt_brokerage + commo_opt_othertaxes;
			$('#commo_opt_total'+num+'').text(parseFloat(commo_opt_total_tax).toFixed(0));

			var commo_opt_breakeven=((commo_toal_opt_buy+commo_opt_total_tax)/commo_opt_qty)-commo_opt_buy;
			$('#commo_opt_breakeven'+num+'').text(parseFloat(commo_opt_breakeven).toFixed(0));

			var commo_opt_pnl=commo_toal_opt_sell - commo_toal_opt_buy - commo_opt_total_tax;
			$('#commo_opt_pnl'+num+'').text(parseFloat(commo_opt_pnl).toFixed(0));

			if(commo_opt_pnl < 0)
			{
				$('#commo_opt_pnl'+num+'').addClass('red_color');			
				$('#commo_opt_pnl'+num+'').removeClass('green_color');
			}
			else
			{
				$('#commo_opt_pnl'+num+'').removeClass('red_color');
				$('#commo_opt_pnl'+num+'').addClass('green_color');
			}
		}
	}
}

function commo_futures(num)
{
	var commo_fut_hidden=document.getElementById('select_comm_check').getAttribute('ccfi');

	var commo_fut_buy=$('#commo_fut_buy'+num+'').val();
	var commo_fut_sell=$('#commo_fut_sell'+num+'').val();
	var commo_fut_qty=$('#commo_fut_qty'+num+'').val();
	if(commo_fut_qty=='' || commo_fut_sell=='' || commo_fut_buy=='')
	{
		$('#commo_fut_turn'+num+'').text(0);
		$('#commo_fut_brokerage'+num+'').text(0);
		$('#commo_fut_stt'+num+'').text(0);
		$('#commo_fut_etc'+num+'').text(0);
		$('#commo_fut_cc'+num+'').text(0);
		$('#commo_fut_gst'+num+'').text(0);
		$('#commo_sebi_fut'+num+'').text(0);
		$('#commo_stamp_duty_fut'+num+'').text(0);
		$('#commo_fut_total'+num+'').text(0);
		$('#commo_fut_breakeven'+num+'').text(0);
		$('#commo_fut_pnl'+num+'').text(0);
		$('#commo_fut_pnl'+num+'').removeClass('red_color');
		$('#commo_fut_pnl'+num+'').addClass('green_color');
	}
	else
	{
		if(commo_fut_hidden=='intraday')
		{
			var commo_toal_fut_sell=commo_fut_qty*commo_fut_sell;
			var commo_toal_fut_buy=commo_fut_qty*commo_fut_buy;
			var commo_turnover=commo_toal_fut_sell+commo_toal_fut_buy;
			$('#commo_fut_turn'+num+'').text(commo_turnover);

			var commo_fut_brokerage=(20 / 100)*commo_turnover;
			$('#commo_fut_brokerage'+num+'').text(parseFloat(commo_fut_brokerage).toFixed(0));

			var commo_fut_stt=(0.05 / 100) * commo_toal_fut_sell;
			$('#commo_fut_stt'+num+'').text(parseInt(commo_fut_stt));

			var commo_fut_t_charges_sel=(0 / 100) * commo_toal_fut_sell;
			var commo_fut_t_charges_buy=(0 / 100) * commo_toal_fut_buy;
			var commo_fut_t_charges=commo_fut_t_charges_sel+commo_fut_t_charges_buy;
			$('#commo_fut_etc'+num+'').text(parseFloat(commo_fut_t_charges).toFixed(0));

			var commo_fut_gst=(18 / 100) * (commo_fut_brokerage+commo_fut_t_charges)
			$('#commo_fut_gst'+num+'').text(parseFloat(commo_fut_gst).toFixed(0));

			var commo_fut_cc=parseFloat($('#commo_fut_cc'+num+'').text())

			var commo_fut_stamp=(0.002 / 100) * commo_toal_fut_buy;
			$('#commo_stamp_duty_fut'+num+'').text(parseFloat(commo_fut_stamp).toFixed(0));

			var commo_fut_sebi_fee=(commo_turnover)*(10/10000000);
			$('#commo_sebi_fut'+num+'').text(parseFloat(commo_fut_sebi_fee).toFixed(0));

			var commo_fut_othertaxes=commo_fut_sebi_fee+commo_fut_stamp+commo_fut_gst+commo_fut_t_charges+commo_fut_cc+parseInt(commo_fut_stt);

			var commo_fut_total_tax=commo_fut_brokerage + commo_fut_othertaxes;
			$('#commo_fut_total'+num+'').text(parseFloat(commo_fut_total_tax).toFixed(0));

			var commo_fut_breakeven=((commo_toal_fut_buy+commo_fut_total_tax)/commo_fut_qty)-commo_fut_buy;
			$('#commo_fut_breakeven'+num+'').text(parseFloat(commo_fut_breakeven).toFixed(0));

			var commo_fut_pnl=commo_toal_fut_sell - commo_toal_fut_buy - commo_fut_total_tax;
			$('#commo_fut_pnl'+num+'').text(parseFloat(commo_fut_pnl).toFixed(0));

			if(commo_fut_pnl < 0)
			{
				$('#commo_fut_pnl'+num+'').addClass('red_color');			
				$('#commo_fut_pnl'+num+'').removeClass('green_color');
			}
			else
			{
				$('#commo_fut_pnl'+num+'').removeClass('red_color');
				$('#commo_fut_pnl'+num+'').addClass('green_color');
			}
		}
		else
		{
			var commo_toal_fut_sell=commo_fut_qty*commo_fut_sell;
			var commo_toal_fut_buy=commo_fut_qty*commo_fut_buy;
			var commo_turnover=commo_toal_fut_sell+commo_toal_fut_buy;
			$('#commo_fut_turn'+num+'').text(commo_turnover);

			var commo_fut_brokerage=(0 / 100)*commo_turnover;
			$('#commo_fut_brokerage'+num+'').text(parseFloat(commo_fut_brokerage).toFixed(0));

			var commo_fut_stt=(0.05 / 100) * commo_toal_fut_sell;
			$('#commo_fut_stt'+num+'').text(parseInt(commo_fut_stt));

			var commo_fut_t_charges_sel=(0 / 100) * commo_toal_fut_sell;
			var commo_fut_t_charges_buy=(0 / 100) * commo_toal_fut_buy;
			var commo_fut_t_charges=commo_fut_t_charges_sel+commo_fut_t_charges_buy;
			$('#commo_fut_etc'+num+'').text(parseFloat(commo_fut_t_charges).toFixed(0));

			var commo_fut_gst=(18 / 100) * (commo_fut_brokerage+commo_fut_t_charges)
			$('#commo_fut_gst'+num+'').text(parseFloat(commo_fut_gst).toFixed(0));

			var commo_fut_cc=parseFloat($('#commo_fut_cc'+num+'').text())

			var commo_fut_stamp=(0.002 / 100) * commo_toal_fut_buy;
			$('#commo_stamp_duty_fut'+num+'').text(parseFloat(commo_fut_stamp).toFixed(0));

			var commo_fut_sebi_fee=(commo_turnover)*(10/10000000);
			$('#commo_sebi_fut'+num+'').text(parseFloat(commo_fut_sebi_fee).toFixed(0));

			var commo_fut_othertaxes=commo_fut_sebi_fee+commo_fut_stamp+commo_fut_gst+commo_fut_t_charges+commo_fut_cc+parseInt(commo_fut_stt);

			var commo_fut_total_tax=commo_fut_brokerage + commo_fut_othertaxes;
			$('#commo_fut_total'+num+'').text(parseFloat(commo_fut_total_tax).toFixed(0));

			var commo_fut_breakeven=((commo_toal_fut_buy+commo_fut_total_tax)/commo_fut_qty)-commo_fut_buy;
			$('#commo_fut_breakeven'+num+'').text(parseFloat(commo_fut_breakeven).toFixed(0));

			var commo_fut_pnl=commo_toal_fut_sell - commo_toal_fut_buy - commo_fut_total_tax;
			$('#commo_fut_pnl'+num+'').text(parseFloat(commo_fut_pnl).toFixed(0));

			if(commo_fut_pnl < 0)
			{
				$('#commo_fut_pnl'+num+'').addClass('red_color');			
				$('#commo_fut_pnl'+num+'').removeClass('green_color');
			}
			else
			{
				$('#commo_fut_pnl'+num+'').removeClass('red_color');
				$('#commo_fut_pnl'+num+'').addClass('green_color');
			}
		}
	}
}

function commo_options(num)
{
	var commo_opt_hidden=document.getElementById('select_comm_check').getAttribute('ccoi');

	var commo_opt_strike=$('#commo_opt_strike'+num+'').val();
	var commo_opt_buy=$('#commo_opt_buy'+num+'').val();
	var commo_opt_sell=$('#commo_opt_sell'+num+'').val();
	var commo_opt_qty=$('#commo_opt_qty'+num+'').val();
	console.log(commo_opt_qty,commo_opt_buy , commo_opt_sell)
	if(commo_opt_qty=='' || commo_opt_sell=='' || commo_opt_buy=='' || commo_opt_strike=='')
	{
		$('#commo_opt_turn'+num+'').text(0);
		$('#commo_opt_brokerage'+num+'').text(0);
		$('#commo_opt_stt'+num+'').text(0);
		$('#commo_opt_etc'+num+'').text(0);
		$('#commo_opt_cc'+num+'').text(0);
		$('#commo_opt_gst'+num+'').text(0);
		$('#commo_sebi_opt'+num+'').text(0);
		$('#commo_stamp_duty_opt'+num+'').text(0);
		$('#commo_opt_total'+num+'').text(0);
		$('#commo_opt_breakeven'+num+'').text(0);
		$('#commo_opt_pnl'+num+'').text(0);
		$('#commo_opt_pnl'+num+'').removeClass('red_color');
		$('#commo_opt_pnl'+num+'').addClass('green_color');
	}
	else
	{
		if(commo_opt_hidden=='intraday')
		{
			var commo_toal_opt_sell=commo_opt_qty*commo_opt_sell;
			var commo_toal_opt_buy=commo_opt_qty*commo_opt_buy;
			var commo_turnover=commo_toal_opt_sell+commo_toal_opt_buy;
			$('#commo_opt_turn'+num+'').text(commo_turnover);

			var commo_opt_brokerage=(20 / 100)*commo_turnover;
			$('#commo_opt_brokerage'+num+'').text(parseFloat(commo_opt_brokerage).toFixed(0));

			var commo_opt_stt=(0.05 / 100) * commo_toal_opt_sell;
			$('#commo_opt_stt'+num+'').text(parseInt(commo_opt_stt));

			var commo_opt_t_charges_sel=(0 / 100) * commo_toal_opt_sell;
			var commo_opt_t_charges_buy=(0 / 100) * commo_toal_opt_buy;
			var commo_opt_t_charges=commo_opt_t_charges_sel+commo_opt_t_charges_buy;
			$('#commo_opt_etc'+num+'').text(parseFloat(commo_opt_t_charges).toFixed(0));

			var commo_opt_gst=(18 / 100) * (commo_opt_brokerage+commo_opt_t_charges)
			$('#commo_opt_gst'+num+'').text(parseFloat(commo_opt_gst).toFixed(0));

			var commo_opt_cc=parseFloat($('#commo_opt_cc'+num+'').text())

			var commo_opt_stamp=(0.003 / 100) * commo_toal_opt_buy;
			$('#commo_stamp_duty_opt'+num+'').text(parseFloat(commo_opt_stamp).toFixed(0));

			var commo_opt_sebi_fee=(commo_turnover)*(10/10000000);
			$('#commo_sebi_opt'+num+'').text(parseFloat(commo_opt_sebi_fee).toFixed(0));

			var commo_opt_othertaxes=commo_opt_sebi_fee+commo_opt_stamp+commo_opt_gst+commo_opt_t_charges+commo_opt_cc+parseInt(commo_opt_stt);

			var commo_opt_total_tax=commo_opt_brokerage + commo_opt_othertaxes;
			$('#commo_opt_total'+num+'').text(parseFloat(commo_opt_total_tax).toFixed(0));

			var commo_opt_breakeven=((commo_toal_opt_buy+commo_opt_total_tax)/commo_opt_qty)-commo_opt_buy;
			$('#commo_opt_breakeven'+num+'').text(parseFloat(commo_opt_breakeven).toFixed(0));

			var commo_opt_pnl=commo_toal_opt_sell - commo_toal_opt_buy - commo_opt_total_tax;
			$('#commo_opt_pnl'+num+'').text(parseFloat(commo_opt_pnl).toFixed(0));

			if(commo_opt_pnl < 0)
			{
				console.log('res')
				$('#commo_opt_pnl'+num+'').addClass('red_color');			
				$('#commo_opt_pnl'+num+'').removeClass('green_color');
			}
			else
			{
				console.log('res')
				$('#commo_opt_pnl'+num+'').removeClass('red_color');
				$('#commo_opt_pnl'+num+'').addClass('green_color');
			}
		}
		else
		{
			var commo_toal_opt_sell=commo_opt_qty*commo_opt_sell;
			var commo_toal_opt_buy=commo_opt_qty*commo_opt_buy;
			var commo_turnover=commo_toal_opt_sell+commo_toal_opt_buy;
			$('#commo_opt_turn'+num+'').text(commo_turnover);

			var commo_opt_brokerage=(0 / 100)*commo_turnover;
			$('#commo_opt_brokerage'+num+'').text(parseFloat(commo_opt_brokerage).toFixed(0));

			var commo_opt_stt=(0.05 / 100) * commo_toal_opt_sell;
			$('#commo_opt_stt'+num+'').text(parseInt(commo_opt_stt));

			var commo_opt_t_charges_sel=(0 / 100) * commo_toal_opt_sell;
			var commo_opt_t_charges_buy=(0 / 100) * commo_toal_opt_buy;
			var commo_opt_t_charges=commo_opt_t_charges_sel+commo_opt_t_charges_buy;
			$('#commo_opt_etc'+num+'').text(parseFloat(commo_opt_t_charges).toFixed(0));

			var commo_opt_gst=(18 / 100) * (commo_opt_brokerage+commo_opt_t_charges)
			$('#commo_opt_gst'+num+'').text(parseFloat(commo_opt_gst).toFixed(0));

			var commo_opt_cc=parseFloat($('#commo_opt_cc'+num+'').text())

			var commo_opt_stamp=(0.003 / 100) * commo_toal_opt_buy;
			$('#commo_stamp_duty_opt'+num+'').text(parseFloat(commo_opt_stamp).toFixed(0));

			var commo_opt_sebi_fee=(commo_turnover)*(10/10000000);
			$('#commo_sebi_opt'+num+'').text(parseFloat(commo_opt_sebi_fee).toFixed(0));

			var commo_opt_othertaxes=commo_opt_sebi_fee+commo_opt_stamp+commo_opt_gst+commo_opt_t_charges+commo_opt_cc+parseInt(commo_opt_stt);

			var commo_opt_total_tax=commo_opt_brokerage + commo_opt_othertaxes;
			$('#commo_opt_total'+num+'').text(parseFloat(commo_opt_total_tax).toFixed(0));

			var commo_opt_breakeven=((commo_toal_opt_buy+commo_opt_total_tax)/commo_opt_qty)-commo_opt_buy;
			$('#commo_opt_breakeven'+num+'').text(parseFloat(commo_opt_breakeven).toFixed(0));

			var commo_opt_pnl=commo_toal_opt_sell - commo_toal_opt_buy - commo_opt_total_tax;
			$('#commo_opt_pnl'+num+'').text(parseFloat(commo_opt_pnl).toFixed(0));

			if(commo_opt_pnl < 0)
			{
				console.log('res')
				$('#commo_opt_pnl'+num+'').addClass('red_color');			
				$('#commo_opt_pnl'+num+'').removeClass('green_color');
			}
			else
			{
				console.log('res')
				$('#commo_opt_pnl'+num+'').removeClass('red_color');
				$('#commo_opt_pnl'+num+'').addClass('green_color');
			}
		}
	}
}

/*function add_another(num)
{
	var addnum=parseFloat(num)+1;
	var subnum=num-1;
	$('#brokerage_calcutor').append('<div class="col-sm-12 col-lg-8 col-md-offset-2 brokerage-section m-auto mb-5"><div class="row"><div class="col-md-3 mb-4"><button class="tablinks'+num+' check_btn" id="intraday" onclick="check_box(\'intraday\',this,\''+num+'\')">Intraday</button></div><div class="col-md-3 mb-4"><button class="tablinks'+num+' no_check_btn" id="delivery'+num+'" value="intraday" onclick="check_box(\'delivery\',this,\''+num+'\')">Delivery</button></div></div><div class="search-input" id="search-input'+num+'"><input type="search" name="" id="search_company'+num+'" placeholder="Enter atleast 3 characters of symbols or name" onkeyup="search_company_byword('+num+')"><div class="autocom-box" id="autocom-box'+num+'"></div></div><div class="row text-left mt-5 mb-5"><div class="col-md-4 input_div"><div>Quantity</div><input type="number" value="1" id="quantity'+num+'" onkeyup="quantity(\''+num+'\')"></div><div class="col-md-4 input_div"><div>Buy Price</div><input type="number" class="pricetext" id="buy_price'+num+'"></div><div class="col-md-4 input_div"><div>Sell Price</div><input type="number" class="pricetext" id="sell_price'+num+'"></div></div><div class="brokerage_charge"><div class="row"><div class="col-md-3 col-sm-3 col-xs-6 charges"><div>Brokerage</div><span>â‚¹&nbsp;<span id="brokerage'+num+'">0.00</span></span></div><div class="col-md-3 col-sm-3 col-xs-6 charges"><div>Other Charges</div><span>â‚¹&nbsp;<span id="othertaxes'+num+'">0.00</span></span></div><div class="col-md-3 col-sm-3 col-xs-6 charges"><div>Breakeven</div><span>â‚¹&nbsp;<span id="breakeven'+num+'">0.00</span></span></div><div class="col-md-3 col-sm-3 col-xs-6 charges"><div>Net PnL</div><span class="lblTotalNetPnl">â‚¹&nbsp;<span id="pnl'+num+'">0.00</span></span></div><div class="clearfix"></div><div class="col-md-12"><hr class="hr_line"></div></div><div class="total_brokerage" id="total_brokerage'+num+'"><div class="row all_text" id="all_text'+num+'"><div class="col-md-6 brokerage_summary"><p>Brokerage<span>â‚¹&nbsp;<span id="brokerage_1'+num+'">0.00</span></span></p><p>STT/CTT <span>â‚¹&nbsp;<span id="stt_ctt'+num+'">0.00</span></span></p><p>Transaction Charges<span>â‚¹&nbsp;<span id="t_charges'+num+'">0.00</span></span></p><p>Clearing Charges<span>â‚¹&nbsp;<span id="c_charges'+num+'">0.00</span></span></p><p>GST<span>â‚¹&nbsp;<span id="gst'+num+'">0.00</span></span></p><p>State Stamp Duty<span>â‚¹&nbsp;<span id="stamp'+num+'">0.00</span></span></p><p>SEBI Turnover Fees<span>â‚¹&nbsp;<span id="sebi_fee'+num+'">0.00</span></span></p><p class="total">TOTAL TAXES AND CHARGES<span>â‚¹&nbsp;<span id="total_tax'+num+'">0.00</span></span></p></div><div class="col-md-6 brokerage_summary"><p>Net Buy Value <span>â‚¹&nbsp;<span id="net_buy_value'+num+'">0.00</span></span></p><p>Net Sell Value <span>â‚¹&nbsp;<span id="net_sell_value'+num+'">0.00</span></span></p><p>Breakeven <span id="breakeven_1'+num+'">â‚¹&nbsp;0.00</span></p></div></div></div><div class="charge_section"><button type="button" id="click_txt'+num+'" onclick="click_txt(\''+num+'\')">View Charges Breakup</button><i class="fas fa-chevron-circle-down" id="fa_icon'+num+'"></i></div></div></div><div class="col-sm-12 col-md-12 mt-3 mb-11" align="center" id="add_btn'+num+'"><button class="add_btn" onclick="add_another(\''+addnum+'\')">Add another order +</button></div>');
	$('#add_btn'+subnum+'').hide();
	$('#summary_div').show();
	$('#total_order_per').val(num)

	var total_sum_brokerage=0;
	var total_sum_tax=0;
	var total_pnl=0;
	var other_charges=0;
	var total_breakeven=0;
	var total_stt_ctt=0;
	var total_t_charges=0;
	var total_c_charges=0;
	var total_gst=0;
	var total_stamp=0;
	var total_sebi_fee=0;
	var total_net_buy_value=0;
	var total_net_sell_value=0;
	var total_order='';
	for (var i = 1; i <= num; i++) {
		total_sum_brokerage =total_sum_brokerage + parseFloat($('#brokerage'+i+'').text());
		total_sum_tax=total_sum_tax+parseFloat($('#total_tax'+i+'').text());
		total_pnl=total_pnl+parseFloat($('#pnl'+i+'').text());
		other_charges=other_charges+parseFloat($('#othertaxes'+i+'').text());
		total_breakeven=total_breakeven+parseFloat($('#breakeven'+i+'').text());
		total_stt_ctt=total_stt_ctt+parseFloat($('#stt_ctt'+i+'').text());
		total_t_charges=total_t_charges+parseFloat($('#t_charges'+i+'').text());
		total_c_charges=total_c_charges+parseFloat($('#c_charges'+i+'').text());
		total_gst=total_gst+parseFloat($('#gst'+i+'').text());
		total_stamp=total_stamp+parseFloat($('#stamp'+i+'').text());
		total_sebi_fee=total_sebi_fee+parseFloat($('#sebi_fee'+i+'').text());
		total_net_buy_value=total_net_buy_value+parseFloat($('#net_buy_value'+i+'').text());
		total_net_sell_value=total_net_sell_value+parseFloat($('#net_sell_value'+i+'').text());
		if($('#search_company'+i+'').val()!='')
		{
			total_order +='<tr><td>'+ $('#search_company'+i+'').val() +'</td><td>'+ $('#quantity'+i+'').val() +'</td><td>'+ $('#buy_price'+i+'').val() +'</td><td>'+ $('#sell_price'+i+'').val() +'</td><td>'+$('#delivery'+i+'').val()+'</td></tr>';
		}
	}
	$('#FooterBrokerage').text(parseFloat(total_sum_brokerage).toFixed(0));
	$('#brokerage').text(parseFloat(total_sum_brokerage).toFixed(0));
	$('#brokerage_1').text(parseFloat(total_sum_brokerage).toFixed(0));
	$('#FooterBrokerageTaxes').text(parseFloat(total_sum_tax).toFixed(0));
	$('#total_tax').text(parseFloat(total_sum_tax).toFixed(0));
	$('#FooterPnl').text(parseFloat(total_pnl).toFixed(0));
	$('#pnl').text(parseFloat(total_pnl).toFixed(0));
	$('#othertaxes').text(parseFloat(other_charges).toFixed(0));
	$('#breakeven').text(parseFloat(total_breakeven).toFixed(0));
	$('#breakeven_1').text(parseFloat(total_breakeven).toFixed(0));
	$('#stt_ctt').text(parseFloat(total_stt_ctt).toFixed(0));
	$('#t_charges').text(parseFloat(total_t_charges).toFixed(0));
	$('#c_charges').text(parseFloat(total_c_charges).toFixed(0));
	$('#gst').text(parseFloat(total_gst).toFixed(0));
	$('#stamp').text(parseFloat(total_stamp).toFixed(0));
	$('#sebi_fee').text(parseFloat(total_sebi_fee).toFixed(0));
	$('#total_order').replaceWith('<tbody id="total_order">'+total_order+'</tbody>');
	$('#net_buy_value').text('â‚¹ '+parseFloat(total_net_buy_value).toFixed(0));
	$('#net_sell_value').text('â‚¹ '+parseFloat(total_net_sell_value).toFixed(0));
}*/


/*================= commodity function end =================*/
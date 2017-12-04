


/*自动完成*/
$(function(){
	
	var availableTags = [
		"ActionScript",
		"AppleScript",
		"Asp",
		"BASIC",
		"C",
		"C++",
		"Clojure",
		"COBOL",
		"ColdFusion",
		"Erlang",
		"Fortran",
		"Groovy",
		"Haskell",
		"Java",
		"JavaScript",
		"Lisp",
		"Perl",
		"PHP",
		"Python",
		"Ruby",
		"Scala",
		"Scheme"
	];
	$( "#autocomplete" ).autocomplete({
		source: availableTags

	});


	// nav-portal-top.html
	$(function () {
		$("#service").hover(function () {
			$(".service").show();
		}, function () {
			$(".service").hide();
		});
		$("#shopcar").hover(function () {
			$("#shopcarlist").show();
		}, function () {
			$("#shopcarlist").hide();
		});

	});
	/*商品分类*/
	$(function () {
		$('.all-sort-list2 > .item').hover(function () {
			//父类分类列表容器的高度
			$(this).addClass('hover');
			$(this).children('.item-list').css('display', 'block');
		}, function () {
			$(this).removeClass('hover');
			$(this).children('.item-list').css('display', 'none');
		});

		$('.item > .item-list > .close').click(function () {
			$(this).parent().parent().removeClass('hover');
			$(this).parent().hide();
		});
	});
	$(function() {
		$('.all-sorts-list').hover(function() {
			$(this).children('.sort').css('display','block')
		},function() {
			$(this).children('.sort').css('display','none')
		})
	});

	// nav-seckill-top.html
	$("#service").hover(function(){
		$(".service").show();
	},function(){
		$(".service").hide();
	});
	$("#shopcar").hover(function(){
		$("#shopcarlist").show();
	},function(){
		$("#shopcarlist").hide();
	});
});

/* JS Document */

/******************************

[Table of Contents]

1. Vars and Inits
2. Set Header
3. Init Menu
4. Init Favorite
5. Init Fix Product Border
6. Init Isotope Filtering
7. Init Price Slider
8. Init Checkboxes
9. Lọc danh mục



******************************/

jQuery(document).ready(function($)
{
	"use strict";

	/*

	1. Vars and Inits

	*/

	var header = $('.header');
	var topNav = $('.top_nav')
	var mainSlider = $('.main_slider');
	var hamburger = $('.hamburger_container');
	var menu = $('.hamburger_menu');
	var menuActive = false;
	var hamburgerClose = $('.hamburger_close');
	var fsOverlay = $('.fs_menu_overlay');

	setHeader();

	$(window).on('resize', function()
	{
		initFixProductBorder();
		setHeader();
	});

	$(document).on('scroll', function()
	{
		setHeader();
	});

	initMenu();
	initFavorite();
	initFixProductBorder();
	initIsotopeFiltering();
	initPriceSlider();
	initCheckboxes();
	filterByCategory();
	initPagination();

	/*

	2. Set Header

	*/

	function setHeader()
	{
		if(window.innerWidth < 992)
		{
			if($(window).scrollTop() > 100)
			{
				header.css({'top':"0"});
			}
			else
			{
				header.css({'top':"0"});
			}
		}
		else
		{
			if($(window).scrollTop() > 100)
			{
				header.css({'top':"-50px"});
			}
			else
			{
				header.css({'top':"0"});
			}
		}
		if(window.innerWidth > 991 && menuActive)
		{
			closeMenu();
		}
	}

	/*

	3. Init Menu

	*/

	function initMenu()
	{
		if(hamburger.length)
		{
			hamburger.on('click', function()
			{
				if(!menuActive)
				{
					openMenu();
				}
			});
		}

		if(fsOverlay.length)
		{
			fsOverlay.on('click', function()
			{
				if(menuActive)
				{
					closeMenu();
				}
			});
		}

		if(hamburgerClose.length)
		{
			hamburgerClose.on('click', function()
			{
				if(menuActive)
				{
					closeMenu();
				}
			});
		}

		if($('.menu_item').length)
		{
			var items = document.getElementsByClassName('menu_item');
			var i;

			for(i = 0; i < items.length; i++)
			{
				if(items[i].classList.contains("has-children"))
				{
					items[i].onclick = function()
					{
						this.classList.toggle("active");
						var panel = this.children[1];
					    if(panel.style.maxHeight)
					    {
					    	panel.style.maxHeight = null;
					    }
					    else
					    {
					    	panel.style.maxHeight = panel.scrollHeight + "px";
					    }
					}
				}
			}
		}
	}

	function openMenu()
	{
		menu.addClass('active');
		// menu.css('right', "0");
		fsOverlay.css('pointer-events', "auto");
		menuActive = true;
	}

	function closeMenu()
	{
		menu.removeClass('active');
		fsOverlay.css('pointer-events', "none");
		menuActive = false;
	}

	/*

	4. Init Favorite

	*/

    function initFavorite()
    {
    	if($('.favorite').length)
    	{
    		var favs = $('.favorite');

    		favs.each(function()
    		{
    			var fav = $(this);
    			var active = false;
    			if(fav.hasClass('active'))
    			{
    				active = true;
    			}

    			fav.on('click', function()
    			{
    				if(active)
    				{
    					fav.removeClass('active');
    					active = false;
    				}
    				else
    				{
    					fav.addClass('active');
    					active = true;
    				}
    			});
    		});
    	}
    }

    /*

	5. Init Fix Product Border

	*/

    function initFixProductBorder()
    {
    	if($('.product_filter').length)
    	{
			var products = $('.product_filter:visible');
    		var wdth = window.innerWidth;

    		// reset border
    		products.each(function()
    		{
    			$(this).css('border-right', 'solid 1px #e9e9e9');
    		});

    		// if window width is 991px or less

    		if(wdth < 480)
			{
				for(var i = 0; i < products.length; i++)
				{
					var product = $(products[i]);
					product.css('border-right', 'none');
				}
			}

    		else if(wdth < 576)
			{
				if(products.length < 5)
				{
					var product = $(products[products.length - 1]);
					product.css('border-right', 'none');
				}
				for(var i = 1; i < products.length; i+=2)
				{
					var product = $(products[i]);
					product.css('border-right', 'none');
				}
			}

    		else if(wdth < 768)
			{
				if(products.length < 5)
				{
					var product = $(products[products.length - 1]);
					product.css('border-right', 'none');
				}
				for(var i = 2; i < products.length; i+=3)
				{
					var product = $(products[i]);
					product.css('border-right', 'none');
				}
			}

    		else if(wdth < 992)
			{
				if(products.length < 5)
				{
					var product = $(products[products.length - 1]);
					product.css('border-right', 'none');
				}
				for(var i = 2; i < products.length; i+=3)
				{
					var product = $(products[i]);
					product.css('border-right', 'none');
				}
			}

			//if window width is larger than 991px
			else
			{
				if(products.length < 5)
				{
					var product = $(products[products.length - 1]);
					product.css('border-right', 'none');
				}
				for(var i = 3; i < products.length; i+=4)
				{
					var product = $(products[i]);
					product.css('border-right', 'none');
				}
			}
    	}
    }

    /*

	6. Init Isotope Filtering

	*/

    function initIsotopeFiltering() {
        var sortTypes = $('.type_sorting_btn');
        var filterButton = $('.filter_button');

        if ($('.product-grid').length) {
            $('.product-grid').isotope({
                itemSelector: '.product-item',
                getSortData: {
                    price: function(itemElement) {
                        var priceEle = $(itemElement).find('.product_price').text().replace('₫', '').replace(/\./g, '').trim();
                        return parseFloat(priceEle);
                    }
                },
                animationOptions: {
                    duration: 750,
                    easing: 'linear',
                    queue: false
                }
            });

            sortTypes.each(function() {
                $(this).on('click', function() {
                    $('.type_sorting_text').text($(this).text());
                    var option = $(this).attr('data-isotope-option');
                    option = JSON.parse(option);

                    if ($(this).hasClass('sort-asc')) {
                        option.sortBy = 'price';
                        option.sortAscending = true;
                    }

                    else if ($(this).hasClass('sort-desc')) {
                        option.sortBy = 'price';
                        option.sortAscending = false;
                    }

                    $('.product-grid').isotope(option);
                });
            });

            filterButton.on('click', function() {
				initPagination();
                $('.product-grid').isotope({
                    filter: function() {
                        var priceRange = $('#amount').val();
                        var priceMin = parseFloat(priceRange.split('-')[0].replace('₫', '').replace(/\./g, '').trim());
                        var priceMax = parseFloat(priceRange.split('-')[1].replace('₫', '').replace(/\./g, '').trim());
                        var itemPrice = $(this).find('.product_price').clone().children().remove().end().text().replace('₫', '').replace(/\./g, '').trim();

                        return (itemPrice >= priceMin) && (itemPrice <= priceMax);
                    },
                    animationOptions: {
                        duration: 750,
                        easing: 'linear',
                        queue: false
                    }
                });
            });
        }
    }

	/* 

	7. Init Price Slider

	*/

	function initPriceSlider() {
		let maxPrice = 0;
		$(".product_price").each(function () {
			const priceText = $(this).text().replace('₫', '').replace(/\./g, '').trim();
			const price = parseFloat(priceText);
			if (!isNaN(price) && price > maxPrice) {
				maxPrice = price;
			}
		});

		$("#slider-range").slider({
			range: true,
			min: 0,
			max: maxPrice,
			values: [0, maxPrice],
			slide: function (event, ui) {
				$("#amount").val(
					ui.values[0].toLocaleString('vi-VN', { useGrouping: true }).replace(/\./g, '.') + " ₫ - " +
					ui.values[1].toLocaleString('vi-VN', { useGrouping: true }).replace(/\./g, '.') + " ₫"
				);
			}
		});

		$("#amount").val(
			$("#slider-range").slider("values", 0).toLocaleString('vi-VN').replace(/\./g, '.') + " ₫ - " +
			$("#slider-range").slider("values", 1).toLocaleString('vi-VN').replace(/\./g, '.') + " ₫"
		);
		
	}

    /*

	8. Init Checkboxes

	*/

    function initCheckboxes()
    {
    	if($('.checkboxes li').length)
    	{
    		var boxes = $('.checkboxes li');

    		boxes.each(function()
    		{
    			var box = $(this);

    			box.on('click', function()
    			{
    				if(box.hasClass('active'))
    				{
    					box.find('i').removeClass('fa-square');
    					box.find('i').addClass('fa-square-o');
    					box.toggleClass('active');
    				}
    				else
    				{
    					box.find('i').removeClass('fa-square-o');
    					box.find('i').addClass('fa-square');
    					box.toggleClass('active');
    				}
    				//box.toggleClass('active');
    			});
    		});

    		if($('.show_more').length)
    		{
    			var checkboxes = $('.checkboxes');

    			$('.show_more').on('click', function()
    			{
    				checkboxes.toggleClass('active');
    			});
    		}
    	};
    }

	/*

	9. Lọc danh mục

	*/

	function filterByCategory() {
		const categoryLinks = document.querySelectorAll('.category-filter');
		const $grid = $('.product-grid').isotope({
			itemSelector: '.product-item',
			layoutMode: 'fitRows'
		})

		categoryLinks.forEach(link => {
			link.addEventListener('click', function () {
				const selectedCategory = this.getAttribute('data-category-id');
				const allCategoryItems = document.querySelectorAll('.category-filter');

				allCategoryItems.forEach(item => {
					item.closest('li').classList.remove('active');
					const span = item.querySelector('span');
					if (span) span.remove();
				});

				this.closest('li').classList.add('active');
				const span = document.createElement('span');
				span.innerHTML = '<i class="fa fa-angle-double-right" aria-hidden="true"></i>';
				this.prepend(span);

				if (selectedCategory === "all") {
					$(".product-item").each(function () {
						$(this).show();
					});
					initPagination();
				} else {
					$(".product-item").each(function () {
						const productCategory = $(this).attr('data-category-id');

						if (productCategory === selectedCategory) {
							$(this).show();
						} else {
							$(this).hide();
						}
					});
				}
				$grid.isotope();
				renderPagination();
			});
		});

		const allCategoryLink = document.querySelector('.category-filter[data-category-id="all"]');
		if (allCategoryLink) {
			allCategoryLink.click();
		}
	}

	/*
	
	10. Phân trang

	*/
	function initPagination() {
		const productsPerPage = 12;
		const productItems = Array.from(document.querySelectorAll(".product-item"));
		const totalProducts = productItems.length;
		const totalPages = Math.ceil(totalProducts / productsPerPage);
		const $grid = $('.product-grid').isotope({
			itemSelector: '.product-item',
			layoutMode: 'fitRows'
		})
	
		const renderPagination = () => {
			const paginationContainer = document.querySelector(".page_selection");
			paginationContainer.innerHTML = "";

			document.querySelector(".total_pages").textContent = totalPages;
	
			for (let i = 1; i <= totalPages; i++) {
				const pageItem = document.createElement("li");
				const pageLink = document.createElement("a");
				pageLink.href = "";
				pageLink.textContent = i;
				pageLink.dataset.page = i;
	
				pageLink.addEventListener("click", (e) => {
					e.preventDefault();
					renderProducts(parseInt(pageLink.dataset.page));
				});
	
				pageItem.appendChild(pageLink);
				paginationContainer.appendChild(pageItem);
			}
		};
	
		const renderProducts = (currentPage) => {
			const start = (currentPage - 1) * productsPerPage;
			const end = start + productsPerPage;
	
			productItems.forEach((product, index) => {
				product.style.display = index >= start && index < end ? "block" : "none";
			});
	
			const currentPageSpan = document.querySelector(".page_current span");
			currentPageSpan.textContent = currentPage;
	
			document.querySelector(".page_previous").style.visibility = currentPage === 1 ? "hidden" : "visible";
			document.querySelector(".page_next").style.visibility = currentPage === totalPages ? "hidden" : "visible";
			$grid.isotope();
		};
	
		document.querySelector(".page_previous").addEventListener("click", (e) => {
			e.preventDefault();
			const currentPage = parseInt(document.querySelector(".page_current span").textContent);
			if (currentPage > 1) {
				renderProducts(currentPage - 1);
			}
		});
	
		document.querySelector(".page_next").addEventListener("click", (e) => {
			e.preventDefault();
			const currentPage = parseInt(document.querySelector(".page_current span").textContent);
			if (currentPage < totalPages) {
				renderProducts(currentPage + 1);
			}
		});
	
		renderPagination();
		renderProducts(1);
	}
});
//Slides
const review_swiper = new Swiper(".review-swiper", {
	pagination: {
		el: ".review-swiper .swiper-pagination",
		clickable: true,
		renderBullet: function (index, className) {
			return (
				'<span class="' +
				className +
				'"><img src="img/image_1.jpg" alt="" style="height: 3rem; width:3rem" class="rounded-circle"></span>'
			);
		},
	},
});
const news_swiper = new Swiper(".news-swiper", {
	pagination: {
		el: ".news-swiper .swiper-pagination",
		clickable: true,
	},
});

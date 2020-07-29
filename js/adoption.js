(function($) {
  const ScreenAdoption = {
    start: function() {
      this.$api = $('[data-api-address]').val();
      this.$listDogs = $('[data-list-dogs]');
      this.$pageTitle = $('[data-page-title]');
      this.$backHome = $('[data-back-home]');
      this.$loadingResults = $('[data-loading-results]');

      this.$backHome.addClass('sr-only');

      this.getBreeds();
      this.bind();
    },

    bind: function() {
      this.$listDogs.on('click', '.list-dogs', $.proxy(this.onDogClick, this));
      this.$listDogs.on('click', '.adopt-button', $.proxy(this.onAdoptClick, this));
    },

    onAdoptClick: function(event) {
      event.preventDefault();
      const $btn = $(event.currentTarget);
      const image = $.trim($btn.data('image'));
      const name  = $.trim($btn.data('name'));
      
      this.$pageTitle.remove();
      this.$listDogs.remove();

      $('.page-title').append(`<h3>Sua lista de adoção</h3><br><br>`);

      // list adopted dogs.
      $('body').append(
        `<div class="container">` +
          `<div class="card card-adoption">` + 
            `<div class="card-body">` + 
              `<div class="row">` +
                `<div class="col-3">` +
                  `<img class="img-fluid" src=${image}>` + 
                `</div>` + 
                `<div class="col-6">` +
                  `<h3 class="card-dog-name">${name}</h3>` +
                `</div>` +                
                `<div class="col-3">` +
                  `<button type="button" class="ml-2 mb-1 close" data-dismiss="card-adoption" aria-label="Close">` + 
                    `<span aria-hidden="true">&times;</span>` +
                  `</button>` + 
                `</div>` +
              `</div>` + 
            `</div>` + 
          `</div>` + 
        `</div>`);
    },

    onDogClick: function(event) {
      this.$loadingResults.removeClass('sr-only');

      event.preventDefault();
      const $btn = $(event.currentTarget);
      const id = (String($btn[0].classList[1]).split("=")[1]);

      this.getDogById(id);
    },

    getDogById: function(id) {
      // Get data from API.
      const gettingById = $.ajax({
        method: 'GET',
        url: `${this.$api}/api/v1/frontend/breeds/get-by-id/${id}`,
        contentType: 'application/json',
      });

      gettingById.done($.proxy(this.onGetByIdSuccess, this));
      gettingById.fail($.proxy(this.onGetByIdFail, this));       
    },

    onGetByIdSuccess: function(data) {
      this.$pageTitle.text('Detalhes');
      $('.list-dogs').remove();
      this.$backHome.removeClass('sr-only');

      this.renderDog(data.data);
    },

    // Specific render dog function.
    renderDog: function(data) {
      this.$loadingResults.addClass('sr-only');
      this.$listDogs.append(
        `<div class='list-dogs data-id=${parseInt(data.id)}'>` + 
          `<div class='card' style='width: 18rem;'>` +
            `<img class='card-img-top' src='${String(data.path_image)}'>`+
            `<div class='card-body content-${data.id}'>` +
              `<h4 class='dog-name'>${String(data.name)}</h4>` +
            `</div>` +
          `</div>` + 
        `</div>`);

      for(var i = 0; i < data.temperament.length; i++) {
        $(`.content-${data.id}`).append(`<span class="dog-personality">${data.temperament[i]}</span>`);
      }

      // Life Span
      $(`.content-${data.id}`).append(
        `<br><br><p class="characteristic">` + 
          `<span><strong>- Life Span:</strong> ${data.life_span}</span>` +
        `</p>`
      );

      // Breed For
      $(`.content-${data.id}`).append(
        `<p class="characteristic">` + 
          `<span><strong>- Breed For:</strong> ${data.bred_for}</span>` +
        `</p>`
      );

      // Breed Group
      $(`.content-${data.id}`).append(
        `<p class="characteristic">` + 
          `<span><strong>- Breed Group:</strong> ${data.breed_group}</span>` +
        `</p>`
      );

      // Weight
      $(`.content-${data.id}`).append(
        `<p class="characteristic">` + 
          `<span><strong>- Weight:</strong> imperial: ${data.weight.imperial}, metric: ${data.weight.metric}</span>` +
        `</p>`
      );

      // Height
      $(`.content-${data.id}`).append(
        `<p class="characteristic">` + 
          `<span><strong>- Weight:</strong> imperial: ${data.height.imperial}, metric: ${data.height.metric}</span>` +
        `</p>`
      );

      $(`.content-${data.id}`).append(
        `<a href="#" class="btn btn-secondary adopt-button" data-id=${data.id} 
          data-image=${data.path_image}
          data-name=${data.name}>ADOTAR</a>`);

    },

    onGetByIdFail: function(error) {
      console.log(error);
    },

    getBreeds: function() {
      // Get data from API.
      const searching = $.ajax({
        method: 'GET',
        url: `${this.$api}/api/v1/frontend/breeds/search`,
        contentType: 'application/json',
      });

      searching.done($.proxy(this.onSearchSuccess, this));
      searching.fail($.proxy(this.onSearchFail, this)); 
    },

    onSearchSuccess: function(data) {
      this.$loadingResults.addClass('sr-only');
      for(var i = 0; i < data.data.length; i++) {

        // Render dog data.
        this.$listDogs.append(
          `<div class='list-dogs data-id=${parseInt(data.data[i].id)}'>` +
            `<div class='card' style='width: 18rem;'>` +
               `<img class='card-img-top' src='${String(data.data[i].path_image)}'>`+
               `<div class='card-body content-${i}'>` +
                `<h4 class='dog-name'>${String(data.data[i].name)}</h4>` +
              `</div>` +
            `</div>` + 
          `</div>`);

        // render dog personality.
        for(var j = 0; j < data.data[i].temperament.length; j++) {
          $(`.content-${i}`).append(`<span class="dog-personality">${data.data[i].temperament[j]}</span>`);
        }
      };
    },

    onSearchFail: function(error) {
      console.log(error);
    }

  };
  $(function() {
    ScreenAdoption.start();
  })    
})(jQuery);
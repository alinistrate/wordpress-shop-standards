/* global jQuery, shop_standards_settings */
(function pageLoad($) {
  // Toggles product filtering by term.
  $('body').on('click', '[data-url]', function (e) {
    console.log('clicked');
    console.log(e.target);
    var url = $(e.target).data('url') || $(e.target).closest('[data-url]').data('url');
    console.log(url);

    if (url) {
      document.location.href = url;
    }
  });
  /**
   * Prevents multiple order to be sent.
   *
   * If the page takes time to be loaded, the user could click multiple
   * times on the place order button and this would generate multiple orders.
   * To prevent this we stop form submit event propagation after the first click.
   */

  var placeOrderBtnInitialValue = $('#place_order').prop('value');
  $('#place_order').click(function disableSubmitOrder(e) {
    if ($(this).hasClass('disabled')) {
      e.preventDefault();
      return;
    }

    $('#place_order').prop('value', 'Ihre Bestellung wird jetzt verarbeitet…').addClass('disabled');
  });
  $(document.body).on('checkout_error', function () {
    $('#place_order').prop('value', placeOrderBtnInitialValue).removeClass('disabled');
  });
  var $variationsForm = $('.variations_form');
  var $variationsSelectDropdowns = $('.variations_form .variations select');
  var $variationSelectChanged = false;
  $variationsSelectDropdowns.change(function variationSelectDropdownChanged() {
    $variationSelectChanged = $(this);
  });
  $('.variations_form').on('woocommerce_variation_has_changed', function () {
    // Allow selecting the default empty value of an attributes dropdown
    // without modifying the value of the others.
    if ($variationSelectChanged && $variationSelectChanged.val() === '') {
      $variationSelectChanged.val('');
      $variationSelectChanged = false;
    } else {
      // If there is only one option left in any of current variation attributes
      // dropdowns, it should be auto-selected.
      $variationsSelectDropdowns.each(function setVariationSelectDropdowns() {
        var $this = $(this);

        if ($this.find('option').size() === 2) {
          $this.val($this.find('option').eq(1).val());
        }
      });
    } // Ensure the rigth product image is displayed.
    // Some delay seems to be needed to refresh the product image.
    // We couldn't find a proper event to hook on, so we used a timeout.


    setTimeout(function () {
      $variationsForm.trigger('check_variations');
    }, 100);
  });
  $('.single_variation_wrap').on('show_variation', function (event, variation) {
    // Updates discount table on product variation change.
    $('[data-variations]').parent().hide();
    $($('[data-variations]')).each(function updateDiscountTable() {
      if ($(this).data('variations').indexOf(variation.variation_id.toString()) !== -1) {
        $(this).parent().show();
      }
    });
  }).on('hide_variation', function () {
    // Hides all variation product discount table on product variation hide.
    $($('[data-variations]')).each(function hideDiscountTable() {
      $(this).parent().hide();
    });
  });
  $(document).ready(function () {
    // Disable copy/paste actions on billing email fields.
    if (shop_standards_settings.emailConfirmationEmail === 'yes') {
      $('#billing_email, #billing_email_confirmation').on('cut copy paste', function (e) {
        e.preventDefault();
      }); // Marks email confirmation field as invalid if does not match email
      // field on form submit.

      $('form.woocommerce-checkout').on('input validate change', function () {
        if ($('#billing_email').val() !== $('#billing_email_confirmation').val()) {
          $('#billing_email_confirmation_field').removeClass('woocommerce-validated').addClass('woocommerce-invalid woocommerce-invalid-required-field');
        }
      });
    }
  }); // Disable checkout button if there are any WooCommerce error displayed.

  $(document).on('ready updated_cart_totals', function () {
    if ($('.woocommerce-error').length) {
      $('.checkout-button').removeAttr('href').addClass('disabled');
      $('.wcppec-checkout-buttons').hide();
    }
  });
})(jQuery);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOlsicGFnZUxvYWQiLCIkIiwib24iLCJlIiwiY29uc29sZSIsImxvZyIsInRhcmdldCIsInVybCIsImRhdGEiLCJjbG9zZXN0IiwiZG9jdW1lbnQiLCJsb2NhdGlvbiIsImhyZWYiLCJwbGFjZU9yZGVyQnRuSW5pdGlhbFZhbHVlIiwicHJvcCIsImNsaWNrIiwiZGlzYWJsZVN1Ym1pdE9yZGVyIiwiaGFzQ2xhc3MiLCJwcmV2ZW50RGVmYXVsdCIsImFkZENsYXNzIiwiYm9keSIsInJlbW92ZUNsYXNzIiwiJHZhcmlhdGlvbnNGb3JtIiwiJHZhcmlhdGlvbnNTZWxlY3REcm9wZG93bnMiLCIkdmFyaWF0aW9uU2VsZWN0Q2hhbmdlZCIsImNoYW5nZSIsInZhcmlhdGlvblNlbGVjdERyb3Bkb3duQ2hhbmdlZCIsInZhbCIsImVhY2giLCJzZXRWYXJpYXRpb25TZWxlY3REcm9wZG93bnMiLCIkdGhpcyIsImZpbmQiLCJzaXplIiwiZXEiLCJzZXRUaW1lb3V0IiwidHJpZ2dlciIsImV2ZW50IiwidmFyaWF0aW9uIiwicGFyZW50IiwiaGlkZSIsInVwZGF0ZURpc2NvdW50VGFibGUiLCJpbmRleE9mIiwidmFyaWF0aW9uX2lkIiwidG9TdHJpbmciLCJzaG93IiwiaGlkZURpc2NvdW50VGFibGUiLCJyZWFkeSIsInNob3Bfc3RhbmRhcmRzX3NldHRpbmdzIiwiZW1haWxDb25maXJtYXRpb25FbWFpbCIsImxlbmd0aCIsInJlbW92ZUF0dHIiLCJqUXVlcnkiXSwibWFwcGluZ3MiOiJBQUFBO0FBRUMsVUFBU0EsUUFBVCxDQUFrQkMsQ0FBbEIsRUFBcUI7QUFDcEI7QUFDQUEsRUFBQUEsQ0FBQyxDQUFDLE1BQUQsQ0FBRCxDQUNHQyxFQURILENBRUksT0FGSixFQUdJLFlBSEosRUFJSSxVQUFDQyxDQUFELEVBQU87QUFDTEMsSUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksU0FBWjtBQUNBRCxJQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FB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LENBQUNlLGNBQUY7QUFDRCxPQUZELEVBRDRELENBSzVEO0FBQ0E7O0FBQ0FqQixNQUFBQSxDQUFDLENBQUMsMkJBQUQsQ0FBRCxDQUErQkMsRUFBL0IsQ0FBa0MsdUJBQWxDLEVBQTJELFlBQU07QUFDL0QsWUFBSUQsQ0FBQyxDQUFDLGdCQUFELENBQUQsQ0FBb0IwQixHQUFwQixPQUE4QjFCLENBQUMsQ0FBQyw2QkFBRCxDQUFELENBQWlDMEIsR0FBakMsRUFBbEMsRUFBMEU7QUFDeEUxQixVQUFBQSxDQUFDLENBQUMsbUNBQUQsQ0FBRCxDQUF1Q29CLFdBQXZDLENBQW1ELHVCQUFuRCxFQUE0RUYsUUFBNUUsQ0FBcUYsd0RBQXJGO0FBQ0Q7QUFDRixPQUpEO0FBS0Q7QUFDRixHQWZELEVBdEZvQixDQXVHcEI7O0FBQ0FsQixFQUFBQSxDQUFDLENBQUNTLFFBQUQsQ0FBRCxDQUFZUixFQUFaLENBQWUsMkJBQWYsRUFBNEMsWUFBTTtBQUNoRCxRQUFJRCxDQUFDLENBQUMsb0JBQUQsQ0FBRCxDQUF3QmdELE1BQTVCLEVBQW9DO0FBQ2xDaEQsTUFBQUEsQ0FBQyxDQUFDLGtCQUFELENBQUQsQ0FBc0JpRCxVQUF0QixDQUFpQyxNQUFqQyxFQUF5Qy9CLFFBQXpDLENBQWtELFVBQWxEO0FBQ0FsQixNQUFBQSxDQUFDLENBQUMsMEJBQUQsQ0FBRCxDQUE4QnNDLElBQTlCO0FBQ0Q7QUFDRixHQUxEO0FBTUQsQ0E5R0EsRUE4R0NZLE1BOUdELENBQUQiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBnbG9iYWwgalF1ZXJ5LCBzaG9wX3N0YW5kYXJkc19zZXR0aW5ncyAqL1xuXG4oZnVuY3Rpb24gcGFnZUxvYWQoJCkge1xuICAvLyBUb2dnbGVzIHByb2R1Y3QgZmlsdGVyaW5nIGJ5IHRlcm0uXG4gICQoJ2JvZHknKVxuICAgIC5vbihcbiAgICAgICdjbGljaycsXG4gICAgICAnW2RhdGEtdXJsXScsXG4gICAgICAoZSkgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZygnY2xpY2tlZCcpO1xuICAgICAgICBjb25zb2xlLmxvZyhlLnRhcmdldCk7XG4gICAgICAgIGNvbnN0IHVybCA9ICQoZS50YXJnZXQpLmRhdGEoJ3VybCcpIHx8ICQoZS50YXJnZXQpLmNsb3Nlc3QoJ1tkYXRhLXVybF0nKS5kYXRhKCd1cmwnKTtcbiAgICAgICAgY29uc29sZS5sb2codXJsKTtcbiAgICAgICAgaWYgKHVybCkge1xuICAgICAgICAgIGRvY3VtZW50LmxvY2F0aW9uLmhyZWYgPSB1cmw7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgKTtcblxuICAvKipcbiAgICogUHJldmVudHMgbXVsdGlwbGUgb3JkZXIgdG8gYmUgc2VudC5cbiAgICpcbiAgICogSWYgdGhlIHBhZ2UgdGFrZXMgdGltZSB0byBiZSBsb2FkZWQsIHRoZSB1c2VyIGNvdWxkIGNsaWNrIG11bHRpcGxlXG4gICAqIHRpbWVzIG9uIHRoZSBwbGFjZSBvcmRlciBidXR0b24gYW5kIHRoaXMgd291bGQgZ2VuZXJhdGUgbXVsdGlwbGUgb3JkZXJzLlxuICAgKiBUbyBwcmV2ZW50IHRoaXMgd2Ugc3RvcCBmb3JtIHN1Ym1pdCBldmVudCBwcm9wYWdhdGlvbiBhZnRlciB0aGUgZmlyc3QgY2xpY2suXG4gICAqL1xuXG4gIGNvbnN0IHBsYWNlT3JkZXJCdG5Jbml0aWFsVmFsdWUgPSAkKCcjcGxhY2Vfb3JkZXInKS5wcm9wKCd2YWx1ZScpO1xuICAkKCcjcGxhY2Vfb3JkZXInKS5jbGljayhmdW5jdGlvbiBkaXNhYmxlU3VibWl0T3JkZXIoZSkge1xuICAgIGlmICgkKHRoaXMpLmhhc0NsYXNzKCdkaXNhYmxlZCcpKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgICQoJyNwbGFjZV9vcmRlcicpLnByb3AoJ3ZhbHVlJywgJ0locmUgQmVzdGVsbHVuZyB3aXJkIGpldHp0IHZlcmFyYmVpdGV04oCmJykuYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XG4gIH0pO1xuICAkKGRvY3VtZW50LmJvZHkpLm9uKCdjaGVja291dF9lcnJvcicsICgpID0+IHtcbiAgICAkKCcjcGxhY2Vfb3JkZXInKS5wcm9wKCd2YWx1ZScsIHBsYWNlT3JkZXJCdG5Jbml0aWFsVmFsdWUpLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpO1xuICB9KTtcblxuICBjb25zdCAkdmFyaWF0aW9uc0Zvcm0gPSAkKCcudmFyaWF0aW9uc19mb3JtJyk7XG4gIGNvbnN0ICR2YXJpYXRpb25zU2VsZWN0RHJvcGRvd25zID0gJCgnLnZhcmlhdGlvbnNfZm9ybSAudmFyaWF0aW9ucyBzZWxlY3QnKTtcbiAgbGV0ICR2YXJpYXRpb25TZWxlY3RDaGFuZ2VkID0gZmFsc2U7XG5cbiAgJHZhcmlhdGlvbnNTZWxlY3REcm9wZG93bnMuY2hhbmdlKGZ1bmN0aW9uIHZhcmlhdGlvblNlbGVjdERyb3Bkb3duQ2hhbmdlZCgpIHtcbiAgICAkdmFyaWF0aW9uU2VsZWN0Q2hhbmdlZCA9ICQodGhpcyk7XG4gIH0pO1xuXG4gICQoJy52YXJpYXRpb25zX2Zvcm0nKS5vbignd29vY29tbWVyY2VfdmFyaWF0aW9uX2hhc19jaGFuZ2VkJywgKCkgPT4ge1xuICAgIC8vIEFsbG93IHNlbGVjdGluZyB0aGUgZGVmYXVsdCBlbXB0eSB2YWx1ZSBvZiBhbiBhdHRyaWJ1dGVzIGRyb3Bkb3duXG4gICAgLy8gd2l0aG91dCBtb2RpZnlpbmcgdGhlIHZhbHVlIG9mIHRoZSBvdGhlcnMuXG4gICAgaWYgKCR2YXJpYXRpb25TZWxlY3RDaGFuZ2VkICYmICR2YXJpYXRpb25TZWxlY3RDaGFuZ2VkLnZhbCgpID09PSAnJykge1xuICAgICAgJHZhcmlhdGlvblNlbGVjdENoYW5nZWQudmFsKCcnKTtcbiAgICAgICR2YXJpYXRpb25TZWxlY3RDaGFuZ2VkID0gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIElmIHRoZXJlIGlzIG9ubHkgb25lIG9wdGlvbiBsZWZ0IGluIGFueSBvZiBjdXJyZW50IHZhcmlhdGlvbiBhdHRyaWJ1dGVzXG4gICAgICAvLyBkcm9wZG93bnMsIGl0IHNob3VsZCBiZSBhdXRvLXNlbGVjdGVkLlxuICAgICAgJHZhcmlhdGlvbnNTZWxlY3REcm9wZG93bnMuZWFjaChmdW5jdGlvbiBzZXRWYXJpYXRpb25TZWxlY3REcm9wZG93bnMoKSB7XG4gICAgICAgIGNvbnN0ICR0aGlzID0gJCh0aGlzKTtcbiAgICAgICAgaWYgKCR0aGlzLmZpbmQoJ29wdGlvbicpLnNpemUoKSA9PT0gMikge1xuICAgICAgICAgICR0aGlzLnZhbCgkdGhpcy5maW5kKCdvcHRpb24nKS5lcSgxKS52YWwoKSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICAvLyBFbnN1cmUgdGhlIHJpZ3RoIHByb2R1Y3QgaW1hZ2UgaXMgZGlzcGxheWVkLlxuICAgIC8vIFNvbWUgZGVsYXkgc2VlbXMgdG8gYmUgbmVlZGVkIHRvIHJlZnJlc2ggdGhlIHByb2R1Y3QgaW1hZ2UuXG4gICAgLy8gV2UgY291bGRuJ3QgZmluZCBhIHByb3BlciBldmVudCB0byBob29rIG9uLCBzbyB3ZSB1c2VkIGEgdGltZW91dC5cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICR2YXJpYXRpb25zRm9ybS50cmlnZ2VyKCdjaGVja192YXJpYXRpb25zJyk7XG4gICAgfSwgMTAwKTtcbiAgfSk7XG5cbiAgJCgnLnNpbmdsZV92YXJpYXRpb25fd3JhcCcpXG4gICAgLm9uKCdzaG93X3ZhcmlhdGlvbicsIChldmVudCwgdmFyaWF0aW9uKSA9PiB7XG4gICAgICAvLyBVcGRhdGVzIGRpc2NvdW50IHRhYmxlIG9uIHByb2R1Y3QgdmFyaWF0aW9uIGNoYW5nZS5cbiAgICAgICQoJ1tkYXRhLXZhcmlhdGlvbnNdJykucGFyZW50KCkuaGlkZSgpO1xuICAgICAgJCgkKCdbZGF0YS12YXJpYXRpb25zXScpKS5lYWNoKGZ1bmN0aW9uIHVwZGF0ZURpc2NvdW50VGFibGUoKSB7XG4gICAgICAgIGlmICgkKHRoaXMpLmRhdGEoJ3ZhcmlhdGlvbnMnKS5pbmRleE9mKHZhcmlhdGlvbi52YXJpYXRpb25faWQudG9TdHJpbmcoKSkgIT09IC0xKSB7XG4gICAgICAgICAgJCh0aGlzKS5wYXJlbnQoKS5zaG93KCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pXG4gICAgLm9uKCdoaWRlX3ZhcmlhdGlvbicsICgpID0+IHtcbiAgICAgIC8vIEhpZGVzIGFsbCB2YXJpYXRpb24gcHJvZHVjdCBkaXNjb3VudCB0YWJsZSBvbiBwcm9kdWN0IHZhcmlhdGlvbiBoaWRlLlxuICAgICAgJCgkKCdbZGF0YS12YXJpYXRpb25zXScpKS5lYWNoKGZ1bmN0aW9uIGhpZGVEaXNjb3VudFRhYmxlKCkge1xuICAgICAgICAkKHRoaXMpLnBhcmVudCgpLmhpZGUoKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICQoZG9jdW1lbnQpLnJlYWR5KCgpID0+IHtcbiAgICAvLyBEaXNhYmxlIGNvcHkvcGFzdGUgYWN0aW9ucyBvbiBiaWxsaW5nIGVtYWlsIGZpZWxkcy5cbiAgICBpZiAoc2hvcF9zdGFuZGFyZHNfc2V0dGluZ3MuZW1haWxDb25maXJtYXRpb25FbWFpbCA9PT0gJ3llcycpIHtcbiAgICAgICQoJyNiaWxsaW5nX2VtYWlsLCAjYmlsbGluZ19lbWFpbF9jb25maXJtYXRpb24nKS5vbignY3V0IGNvcHkgcGFzdGUnLCAoZSkgPT4ge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB9KTtcblxuICAgICAgLy8gTWFya3MgZW1haWwgY29uZmlybWF0aW9uIGZpZWxkIGFzIGludmFsaWQgaWYgZG9lcyBub3QgbWF0Y2ggZW1haWxcbiAgICAgIC8vIGZpZWxkIG9uIGZvcm0gc3VibWl0LlxuICAgICAgJCgnZm9ybS53b29jb21tZXJjZS1jaGVja291dCcpLm9uKCdpbnB1dCB2YWxpZGF0ZSBjaGFuZ2UnLCAoKSA9PiB7XG4gICAgICAgIGlmICgkKCcjYmlsbGluZ19lbWFpbCcpLnZhbCgpICE9PSAkKCcjYmlsbGluZ19lbWFpbF9jb25maXJtYXRpb24nKS52YWwoKSkge1xuICAgICAgICAgICQoJyNiaWxsaW5nX2VtYWlsX2NvbmZpcm1hdGlvbl9maWVsZCcpLnJlbW92ZUNsYXNzKCd3b29jb21tZXJjZS12YWxpZGF0ZWQnKS5hZGRDbGFzcygnd29vY29tbWVyY2UtaW52YWxpZCB3b29jb21tZXJjZS1pbnZhbGlkLXJlcXVpcmVkLWZpZWxkJyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG5cbiAgLy8gRGlzYWJsZSBjaGVja291dCBidXR0b24gaWYgdGhlcmUgYXJlIGFueSBXb29Db21tZXJjZSBlcnJvciBkaXNwbGF5ZWQuXG4gICQoZG9jdW1lbnQpLm9uKCdyZWFkeSB1cGRhdGVkX2NhcnRfdG90YWxzJywgKCkgPT4ge1xuICAgIGlmICgkKCcud29vY29tbWVyY2UtZXJyb3InKS5sZW5ndGgpIHtcbiAgICAgICQoJy5jaGVja291dC1idXR0b24nKS5yZW1vdmVBdHRyKCdocmVmJykuYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XG4gICAgICAkKCcud2NwcGVjLWNoZWNrb3V0LWJ1dHRvbnMnKS5oaWRlKCk7XG4gICAgfVxuICB9KTtcbn0oalF1ZXJ5KSk7XG4iXSwiZmlsZSI6Im1haW4uanMifQ==
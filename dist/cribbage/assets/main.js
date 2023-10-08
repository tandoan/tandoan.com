$('.website_address_wrapper').remove();

$(document).on('click', function(e) {
    if ($(e.target).closest('#menu-toggle').length) {
        $('#container').toggleClass('show-menu');
    } else if (!$(e.target).closest('#sidebar').length) {
        $('#container').removeClass('show-menu');
    }
});

$('.fullscreen-btn').click(function() {
    $('body').toggleClass('fullscreen');
});

// Initialize clipboard.js copy button
// NOTE: this must be called in each page's JS file because main.js loads before clipboard.js
function initClipboardBtn(btnID) {
    // Check whether clipboard.js has been loaded
    if (typeof ClipboardJS !== 'function') return false;
    var clipboard = new ClipboardJS('#'+btnID);
    clipboard.on('success', function(e) {
        showCopyStatus(btnID, '<i class="fa fa-check"></i> copied!');
    });
    clipboard.on('error', function(e) {
        showCopyStatus(btnID, '<i class="fa fa-times"></i> error');
    });
}

function showCopyStatus(btnID, html) {
    $('.copy-status').remove();
    var $popup = $('<div>', {'class': 'copy-status'}).html(html);
    $popup.appendTo('#'+btnID);
    setTimeout(function() {
        $popup.fadeOut(250, function() {
            $popup.remove();
        });
    },2000);
}

function getAjaxError(jqXHR, exception) {
    var sendErr = '';
    if (jqXHR.status === 0) {
        sendErr = 'Not connected. Verify network.';
    } else if (jqXHR.status == 404) {
        sendErr = 'Requested page not found. [404]';
    } else if (jqXHR.status == 500) {
        sendErr = 'Internal Server Error [500]';
    } else if (exception === 'parsererror') {
        sendErr = 'Requested JSON parse failed';
    } else if (exception === 'timeout') {
        sendErr = 'Request took too long';
    } else if (exception === 'abort') {
        sendErr = 'Request aborted';
    } else {
        sendErr = 'Uncaught Error. ' + jqXHR.responseText;
    }
    return sendErr;
}
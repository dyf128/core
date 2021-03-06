/**
 * Copyright (c) 2011, Robin Appelman <icewind1991@gmail.com>
 * This file is licensed under the Affero General Public License version 3 or later.
 * See the COPYING-README file.
 */

/**
 * Post the email address change to the server.
 */
function changeEmailAddress(){
    emailInfo = $('#email');
    if (emailInfo.val() === emailInfo.defaultValue){
        return;
    }
    emailInfo.defaultValue = emailInfo.val();
    OC.msg.startSaving('#lostpassword .msg');
    var post = $( "#lostpassword" ).serialize();
    $.post( 'ajax/lostpassword.php', post, function(data){
        OC.msg.finishedSaving('#lostpassword .msg', data);
    });
}

$(document).ready(function(){
	$("#passwordbutton").click( function(){
		if ($('#pass1').val() != '' && $('#pass2').val() != '') {
			// Serialize the data
			var post = $( "#passwordform" ).serialize();
			$('#passwordchanged').hide();
			$('#passworderror').hide();
			// Ajax foo
			$.post( 'ajax/changepassword.php', post, function(data){
				if( data.status == "success" ){
					$('#pass1').val('');
					$('#pass2').val('');
					$('#passwordchanged').show();
				}
				else{
					$('#passworderror').html( data.data.message );
					$('#passworderror').show();
				}
			});
			return false;
		} else {
			$('#passwordchanged').hide();
			$('#passworderror').show();
			return false;
		}

	});

	$("#displaynamebutton").click( function(){
		if ($('#displayName').val() != '' ) {
			// Serialize the data
			var post = $( "#displaynameform" ).serialize();
			$('#displaynamechanged').hide();
			$('#displaynemerror').hide();
			// Ajax foo
			$.post( 'ajax/changedisplayname.php', post, function(data){
				if( data.status == "success" ){
					$('#displaynamechanged').show();
					$('#oldDisplayName').text($('#displayName').val());
					// update displayName on the top right expand button
					$('#expandDisplayName').text($('#displayName').val());
				}
				else{
					$('#newdisplayname').val(data.data.displayName)
					$('#displaynameerror').html( data.data.message );
					$('#displaynameerror').show();
				}
			});
			return false;
		} else {
			$('#displayName').val($('#oldDisplayName').val());
			$('#displaynamechanged').hide();
			$('#displaynameerror').show();
			return false;
		}

	});

    $('#email').keyup(function(){
        if(typeof timeout !== 'undefined'){
            clearTimeout(timeout);
        }
        timeout = setTimeout('changeEmailAddress()',1000);
    });

	$("#languageinput").chosen();

	$("#languageinput").change( function(){
		// Serialize the data
		var post = $( "#languageinput" ).serialize();
		// Ajax foo
		$.post( 'ajax/setlanguage.php', post, function(data){
			if( data.status == "success" ){
				location.reload();
			}
			else{
				$('#passworderror').html( data.data.message );
			}
		});
		return false;
	});
} );

OC.msg={
	startSaving:function(selector){
		$(selector)
			.html( t('settings', 'Saving...') )
			.removeClass('success')
			.removeClass('error')
			.stop(true, true)
			.show();
	},
	finishedSaving:function(selector, data){
		if( data.status == "success" ){
			 $(selector).html( data.data.message )
				.addClass('success')
				.stop(true, true)
				.delay(3000)
				.fadeOut(600);
		}else{
			$(selector).html( data.data.message ).addClass('error');
		}
	}
};

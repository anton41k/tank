function headband(){
  if(label_construction){clearInterval(intervalID); $('.tank img#tank').remove(); $('.tank img').hide(); }
  else{$('.tank').html('')}
  $('.tank').stopTime('tank_timer');
  label_speed_creat_tank = true;
  var width_word = size_width - SIZE;
  $('.tank').css({'border-width':(SIZE/2)+'px 0px '+(SIZE/2)+'px '+(SIZE/2)+'px'});
  $('.control').css({'width':(SIZE/2)*5+'px','height':size_width+SIZE+'px','left':size_width+SIZE/2+'px'});
  if(!$('.control img').is('[id="id_img_control"]'))
    {
      $('.control').append("<img id=id_img_control width="+(((SIZE/2)*5)-2)+"px height="+(size_width-2)+"px style='border: 1px solid #bde810;position:absolute;left:0;top:"+(SIZE/2)+"px' src='/static/img/control.png' >")
    }
  $('.control img#id_img_control:hidden').show();
  $('.control table#count_enemy_tank').remove();
  $('.control div#menu_tank_players').remove();
  $('.control div#menu_control_show').remove();
  $('.tank').append("<img id='headband' class='headband' width="+width_word+" src='/static/img/battle-city.png' >");
  var height_title= $('#headband').height();
  $('#headband').css({'padding':SIZE/2+'px', 'top':(-height_title)+'px'});
  $('.tank').css({'overflow': 'hidden'});
  $('#headband').animate({top:SIZE/2+'px'},{duration:3000, easing:'easeOutBounce', complete:function()
    { 
      var fontsize = Math.round(SIZE/2.7);
      $('.tank').append('<table id="headband_score" style="font-size:'+fontsize+'px;"><tr><td>&#8544;-&nbsp;'+score_tank1.score+'</td><td>HI-&nbsp;'+HI+'</td><td id="headband_score_tank2"></td></tr></table>');
      $('div#menu').find('div').css({'cursor':'pointer'});
      $('div#one_players').prepend("<img id='cursor' width="+SIZE/1.5+" src='/static/img/cursor_tank.gif' style='left:"+(-SIZE)+"px'>")
      if(label_two_players){$('#headband_score_tank2').append('&#8545;-&nbsp;'+score_tank2.score)}
    }});
  $('.tank').append("<div id='menu' class='headband'>\
                                <div id='one_players'>\
                                    1 ИГРОК</div>\
                                <div id='two_players'> 2 ИГРОКА</div>\
                                <div id='construction'> КОНСТРУКТОР</div>\
                     </div>");
  $('div#menu').find('div').css({'margin-top':SIZE/3+'px'});
  var size_menu = [$('#menu').width(), $('#menu').height()];
  $('#menu').css({'bottom':(-size_menu[1])+'px', 'left':'50%','margin-left':(-size_menu[0]/2)+'px', 'font-size':SIZE/2+'px'});
  $('#menu').animate({top:(size_height/2)+'px'},{duration:3000, easing:'easeOutBounce', complete:function()
    {
      $('#one_players').attr('onclick', 'show_tank()');
      $('#two_players').attr('onclick', 'show_tank(true)');
      $('#construction').attr('onclick', 'construction()');
    }});
}

$('body').on('mouseenter', '#one_players, #two_players, #construction', function (e) {
  var cursor = $('#cursor');
  $(this).prepend(cursor);
})

 
var intervalID;
function construction(){
  runOnKeys(control_tank1);
  cx=0; cy=0;
  if(label_construction)
    {
      $('.tank img:hidden').show();
      $('.tank .headband:visible').remove();
      $(".tank table#headband_score").remove();
    }
  else
    { 
      $('.tank').html('');
      creat_after_death = false;
      var protection_list = [base, brick_wall_right_angle, brick_wall_bottom, brick_wall_left_angle, brick_wall_right, brick_wall_left];
      standart(protection_list, 4);
    }
  label_construction = true;
  creation_elem(tank1, tank1.name, [0, 0]);   
  $('#tank').css({'z-index':2})
  intervalID = setInterval( function() 
    { 
      $('#tank').hide();
      setTimeout(function()
        {
          $('#tank').show()
        },600); 
    } , 1000); 
}
var memory_count_presed;
var count_presed = 0;
var f=new Array(13), cx=0, cy=0;
for(var i = 0; i < f.length; i++)
  f[i] = new Array(13);
for(var j = 0; j < f.length; j++) {
  for(n = 0; n < f[j].length; n++) {
    f[j][n] = 'road';
  }
}

function control_cursor_construction(pressed_but){
  label_construction = true;
  var cursor_tank = document.images['tank'];
  var pos_cursor_tank = [number(cursor_tank.style.left), number(cursor_tank.style.top)];
  var speed_cursor_tank = SIZE;
  if(memory_count_presed != undefined){count_presed = memory_count_presed;}
  switch(pressed_but) {
    case 37: // влево
      cursor_tank.style.left = pos_cursor_tank[0] - speed_cursor_tank + 'px';
      border(cursor_tank,'left');
      cy > 0 ? cy -= 1 : cy = 0;
      break;
    case 38: // вверх
      cursor_tank.style.top = pos_cursor_tank[1] - speed_cursor_tank + 'px';
      border(cursor_tank,'top');
      cx > 0 ? cx -= 1 : cx = 0;
      break;
    case 39: // вправо
      cursor_tank.style.left = pos_cursor_tank[0] + speed_cursor_tank + 'px';
      border(cursor_tank,'left');
      cy < (field1.battlefield[0].length-1) ? cy += 1 : cy = (field1.battlefield[0].length-1);
      break;
    case 40: // вниз
      cursor_tank.style.top = pos_cursor_tank[1] + speed_cursor_tank + 'px';
      border(cursor_tank,'top');
      cx < (field1.battlefield[0].length-1) ? cx += 1 : cx = (field1.battlefield[0].length-1);
      break;
  }//end switch
}

function draw_obstacle(){
  memory_count_presed = count_presed;
  var pos_cursor = [number($('#tank').css('left')), number($('#tank').css('top'))];
  var selection_element = list_all_obstacle[count_presed];
  remove_old_img(pos_cursor);
  if(selection_element)
    {
      creation_elem(selection_element, selection_element.name, pos_cursor);
      
      f[cx][cy]=selection_element.constructor;
    }
  count_presed += 1;
  if(count_presed == list_all_obstacle.length+1){count_presed = 0}
}

function remove_old_img(pos_c){ 
  $(".tank img[name!='tank1'][style*='left: "+pos_c[0]+"px; top: "+pos_c[1]+"px']").remove();
  $(".tank img[name!='tank1'][style*='left: "+(pos_c[0]+SIZE/2)+"px; top: "+pos_c[1]+"px']").remove();
  $(".tank img[name!='tank1'][style*='left: "+pos_c[0]+"px; top: "+(pos_c[1]+SIZE/2)+"px']").remove();
  $(".tank img[name!='tank1'][style*='left: "+(pos_c[0]+SIZE/2)+"px; top: "+(pos_c[1]+SIZE/2)+"px']").remove();
}













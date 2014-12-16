var SIZE = 40;
var enemy_tank = {'name':'enemy_tank','angle':180,'type':'auto','speed':speed(11),'life':1, 'permit':'.gif', 'score':100}
var enemy_tank_scor = {'name':'enemy_tank1','angle':180,'type':'auto','speed':speed(8),'life':1, 'permit':'.gif', 'score':200}
var enemy_tank_big = {'name':'enemy_tank2','angle':180,'type':'auto','speed':speed(12),'life':3, 'permit':'.gif', 'score':300}
var enemy_tank_super = {'name':'enemy_tank3','angle':180,'type':'auto','speed':speed(13),'life':4, 'permit':'.gif', 'score':400}

var tank1 = {'name':'tank1','angle':0,'type':'tank','speed':speed(10),'life':1, 'count_attempts':3, 'permit':'.png'}
var tank2 = {'name':'tank2','angle':0,'type':'tank','speed':speed(10),'life':1, 'count_attempts':3, 'permit':'.png'}

var base = {'name':'base','angle':0,'type':'base','speed':0,'life':1, 'permit':'.gif'}

var missile = {'name':'missile','angle':0,'type':'auto','speed':'automatic','life':1, 'permit':'.png'}

var list_all_enemy_tank = [enemy_tank, enemy_tank_scor, enemy_tank_big, enemy_tank_super];
var list_all_obstacle = [brick_wall, brick_wall_top, brick_wall_right, brick_wall_bottom, brick_wall_left, 
                         concrete_wall, concrete_wall_top, concrete_wall_right, concrete_wall_bottom, concrete_wall_left,
                         forest_wall, forest_wall_top, forest_wall_right, forest_wall_bottom, forest_wall_left,
                         river_wall, river_wall_top, river_wall_right, river_wall_bottom, river_wall_left, ];
                         
function speed(index_speed){return Math.round(SIZE / index_speed)};
  

var size_width = SIZE * field1.battlefield[0].length;
var size_height = size_width;
var size = size_width / field1.battlefield[0].length;
var working_size = size_width - size;
var re = /[^.-\d+]/g;
var size_missile = [Math.round(size/8), Math.round(size/5)];
var size_explosion = [Math.round(size/2), Math.round(size/2)];
var count_attempts_my_tank1 = 3;
var count_attempts_my_tank2 = 3;

var count_attempts_enemy_tank = 6;
var creat_after_death;
var label_construction;
var label_two_players;
var label_speed_creat_tank;
var center_battlefield = Math.floor(field1.battlefield[0].length/2);
var coord_tanks = [[0, 0], 
                   [size * center_battlefield, 0], 
                   [working_size, 0], 
                   [((size * center_battlefield)-size*2), working_size],
                   [size * center_battlefield, working_size], 
                   [((size * center_battlefield)-size), working_size-size], 
                   [size * center_battlefield, working_size-size],
                   [((size * center_battlefield)+size), working_size-size],
                   [((size * center_battlefield)-size), working_size],
                   [((size * center_battlefield)+size), working_size],
                   [((size * center_battlefield)+size*2), working_size]]
var stop_enemy_tank;

var control_tank2 = [65,87,68,83];
var control_tank1 = [37,38,39,40];
var stage = 1;
var HI = 20000;
var label_game_over;
var label_starting_stage;

function show_tank(count_players){
    count_players ? label_two_players = true : label_two_players = false;
    if(label_construction)
      {
        $('.tank img:hidden').show();
        $('.tank .headband:visible').remove();
        if(label_two_players){runOnKeys(control_tank1, control_tank2);}
        else{runOnKeys(control_tank1);}
        return headdand_stage();
      }
    if(stage == 1){$('.tank').html('')}
    var height, width, lable_old_obj;
    height = 0;
    var s;
    try
      {s = window['field'+stage].battlefield;}
    catch(err)
      {stage = 1;s = window['field'+stage].battlefield;$('.tank').html('')}
    $.each(s, function(index, value){
      width = 0;
      $.each(value, function(ind, e){
        if(e){
          lable_old_obj = true;
          for(var i in coord_tanks)
          {
            if(coord_tanks[i][0] == width && coord_tanks[i][1] == height){lable_old_obj = false;}
          }
          if(lable_old_obj)
          {
            creation_elem(e, e.name, [width, height]);
          }
        }
        width += size
      });
      height += size;
      $('.tank').append("<br>")
    });
    headdand_stage();
    if(label_two_players){runOnKeys(control_tank1, control_tank2);}
    else{runOnKeys(control_tank1);}
  }

function number(element){
  return Number(element.replace(/[^.-\d+]/g,''))
}

var count_creation_enemy_tank = 0;
function creation_elem(e, name, pos, obj){
  var timer_val, time_animate, pos_obj;
  if(obj){pos_obj = [obj.style.left, obj.style.top];}
  if(e.name.indexOf('tank') != -1 || e.type == 'base')
    { 
      if(e.type == 'tank' || e.type == 'base'){timer_val = 0;}
      else
        {
          if(!label_detonation && (creat_after_death || label_speed_creat_tank)){count_creation_enemy_tank = 0}
          label_speed_creat_tank = false;
          count_creation_enemy_tank += 1;
          timer_val = 4000 * count_creation_enemy_tank;
        }
      if(!creat_after_death)
        {
          e.type == 'auto' ? name = name + pos[0] + pos[1] : name = e.name;
          $('.tank').append("<img id='"+e.type+"' name='"+name+"'>");
          if(e.type == 'tank'){$("img[name='" + name + "']").data('count_attempts', e.count_attempts)};
        }
      else
        {
          $('.tank').append("<img id='explosion' name='explosion"+name+"' src='/static/img/explosion_tank.gif'>");
          $("img[name='explosion"+name+"']").css({'width':size+'px', 'height':size+'px', 'left':pos_obj[0], 'top':pos_obj[1]});
          setTimeout(function(){$("img[name='explosion"+name+"']").remove();},200)
        }
      $("img[name='" + name + "']").attr({'src':'/static/img/'+e.name+e.permit}); 
      if(e.type == 'auto')
        {
          if(obj && count_attempts_enemy_tank <= 0){$(obj).remove()}
          $("img[name='" + name + "']").attr({'class':count_attempts_enemy_tank});
          count_attempts_enemy_tank -= 1;
          if(!$('.tank img').is('[name^="enemy_tank"]')){label_game_over = false;setTimeout(function(){return result_of_the_game()},5000)}
          
          $("img[name='" + name + "']").data('score', e.score);
          if(list_bonus_enemy_tank.indexOf(count_attempts_enemy_tank) != -1)
            {
              $("img[name='" + name + "']").data('bonus',true);
              $("img[name='" + name + "']").attr({'src':'/static/img/'+e.name+'_bonus'+e.permit});
            }
          else if($("img[name='" + name + "']").data('bonus'))
            {$("img[name='" + name + "']").data('bonus',false)}
        }
      
      $("img[name='" + name + "']").css({'left':pos[0] + size/2 + 'px', 'top':pos[1] + size/2 + 'px', 'transform':'rotate('+e.angle+'deg)', 'width':0, 'height':0});
      $("img[name='" + name + "']").data({'shot':false, 'speed':0, 'creat':false, 'life':e.life, 'type':e.type});
      setTimeout(function()
        {
          if(label_construction || e.type == 'base'){time_animate = 0;} 
          else{time_animate = 2000;}
          $("img[name='" + name + "']").animate({'width':size+'px', 'height':size+'px', 'left':pos[0] + 'px', 'top':pos[1] + 'px',}, {duration:time_animate, easing:"linear", complete:function()
            {
              $(this).data({'shot':true, 'pos_left': pos[0], 'pos_top': pos[1], 'speed':e.speed, 'label_rotate':false});
              var obj_name = $(this).attr('name');
              var class_obj = $(this).attr('class');
              if(obj_name == 'base'){$(this).data({'creat':true})}
              else if(obj_name.lastIndexOf('tank') == 0)
                {
                  $(this).data({'label_movement':true, 'armor':false});
                  if(!label_construction)
                    {
                      var name_bonus = 'armor_tank_'+obj_name;
                      $('.tank').append("<img name="+name_bonus+" src='/static/img/armor_tank.gif'>");
                      $('img[name="'+name_bonus+'"]').css({'width':size, 'height':size, 'left':pos[0]+'px','top':pos[1]+'px'});
                      $(this).data('armor',true);
                      other_border(this);
                      setTimeout(function()
                        {
                          $('img[name="'+obj_name+'"]').data('armor',false);
                          $('img[name="'+name_bonus+'"]').remove();
                        },5000)
                    }
                }
              else if(obj_name.lastIndexOf('enemy_tank') == 0)
                {$('#count_enemy_tank img[name="number_enemy_tank'+class_obj+'"]').remove();}
            }});
        },timer_val);
    }      
  else if(e.placing){
    var name_block, x_pos = pos[0], y_pos = pos[1];
    for (var i = 0; i < e.placing.length; i++) {
      if(i == 2)
        {
          y_pos += size/2;
          x_pos = pos[0];
        }
      if(e.placing[i] == 1)
        {
          name_block = name + x_pos + y_pos;
          $('.tank').append("<img id='"+e.type+"' name='"+name_block+"' src='/static/img/"+e.name+e.permit+"'>");
          if(e.type == 'forest'){$("img[name='" + name_block + "']").css('z-index',1);}
          $("img[name='" + name_block + "']").css({'width':size/2, 'height':size/2, 'left':x_pos + 'px','top':y_pos + 'px','transform':'rotate('+e.angle+'deg)'});
          $("img[name='" + name_block + "']").data({'creat':true, 'life':e.life, 'type':e.type});
        }
      x_pos += size/2;
      
  }};
}

function headdand_stage(){
 $('.tank table#headband_score').remove();
 $('.tank').append("<div id='stageUp' style='width:"+size_width+"px; height:"+(size_width/2)+"px; left:0; top:0; background:silver;  position:absolute;z-index:2;'></div>");
  $('.tank').append("<div id='stageDown' style='width:"+size_width+"px;  left:0; top:"+size_width+"px; background:silver; position:absolute;z-index:2;'></div>");
  $('.tank img').hide();
  if(stage != 1)
    {
      $('.tank img[name="tank1"]').css({'left':coord_tanks[3][0]+'px', 'top':coord_tanks[3][1]+'px', 'transform':'rotate(0deg)'})
      $('.tank img[name="tank2"]').css({'left':coord_tanks[10][0]+'px', 'top':coord_tanks[10][1]+'px', 'transform':'rotate(0deg)'})
    }
  $('.tank table#score').remove();
  $('.tank #stageUp').slideUp(0).slideDown(1000);
  $('.tank #stageDown').animate({'height':(size_width/2)+'px', 'top':(size_width/2)+'px'},
                                  {duration:1000, 
                                   easing:"linear", 
                                   complete:function(){
                                       $('.tank').append("<p id='stage' style='z-index:2;font-size:"+SIZE/2+"px;'> STAGE "+stage+"</p>");
                                       label_starting_stage = true;
                                     }});
  $('#id_img_control').hide();
  $('.control table#count_enemy_tank').remove();
  count_attempts_enemy_tank = 6;
  $('.control').append("<table id='count_enemy_tank' style='position:absolute;left:50%;top:"+(SIZE/2)+"px;margin-left:"+(-(SIZE/2)*5)/4+"px'></table>");
  for(var i = 1; i <= count_attempts_enemy_tank; i++) 
    {
      if(i % 2 != 0)
        {
          $('#count_enemy_tank').append('<tr>\
                                           <td><img width='+(SIZE/2)+'px name="number_enemy_tank'+i+'" src="/static/img/label_enemy_tank.png"></td>\
                                           <td><img width='+(SIZE/2)+'px name="number_enemy_tank'+(i+1)+'" src="/static/img/label_enemy_tank.png"></td>\
                                         </tr>')
        }
    } 
  $('.control div#menu_tank_players').remove();
  if(!$('.control div').is('[id="menu_control_show"]')){$('.control').append('<div id="menu_control_show"></div>');}
  $('.control').append("<div style='position:absolute; left:50%; top:60%; margin-left:"+(-(SIZE/2)*5)/4+"px; font-weight:bold; font-size:"+SIZE/2+"px' id='menu_tank_players'>\
                          <div id='player1'>\
                            &#8544;&nbsp;P<br>\
                            <img style='float:left;' width="+(SIZE/2)+"px src='/static/img/label_my_tank.png'>\
                            <div id='tank1'>"+tank1.count_attempts+"</div>\
                          </div><br>\
                          <div id='player2'></div><br>\
                          <div id='stages'>\
                            <img width="+SIZE+"px src='/static/img/label_stage.png'>\
                            <br>"+stage+"\
                          </div>\
                        </div>");
  if(label_two_players)
    {
      $('div #player2').append("&#8545;&nbsp;P<br><img style='float:left;' width="+(SIZE/2)+"px src='/static/img/label_my_tank.png'><div id='tank2'>"+tank2.count_attempts+"</div>")
    }
  $('body').on('mouseout mouseover', '#menu_control_show', function (e) {
    if(e.type == 'mouseover')
      {
        $('.control').children().hide();
        $('.control img#id_img_control').show();
      }
    else if(e.type == 'mouseout')
      {
        $('.control').children().show();
        $('.control img#id_img_control').hide();
      }
  })
}

var list_bonus_enemy_tank = [];
function start_draw(){
  $('.tank #stage').remove();
  $('.tank img:hidden').show();
  creat_after_death = false;
  label_starting_stage = false;
  if(label_game_over)
    {
      score_tank1 = {'score':0, 100:0, 200:0, 300:0, 400:0};
      score_tank2 = {'score':0, 100:0, 200:0, 300:0, 400:0};
    }
  list_bonus_enemy_tank = [];
  for(var i = 0; i < window['field'+stage].stage; i++) 
    {
      list_bonus_enemy_tank[list_bonus_enemy_tank.length] = Math.floor(Math.random() * (count_attempts_enemy_tank - 1) + 1)
    }
  var list_draw_obj;
  stage == 1 ? list_draw_obj = [enemy_tank, enemy_tank, enemy_tank, tank1, base] : list_draw_obj = [enemy_tank, enemy_tank, enemy_tank, , base]; 
  var protection_base = [brick_wall_right_angle, brick_wall_bottom, brick_wall_left_angle, brick_wall_right, brick_wall_left];
  if(!label_construction){list_draw_obj = list_draw_obj.concat(protection_base)}
  if(label_two_players && stage == 1){list_draw_obj[10] = tank2;}
  standart(list_draw_obj, 0);
  label_construction = false;
  $('.tank #stageUp').slideUp(1000);
  $('.tank #stageDown').animate({'height':'0px', 'top':(size_width)+'px'},
                                  {duration:1000, 
                                   easing:"linear", 
                                   complete:function(){
                                       $('.tank #stageUp').remove();
                                       $('.tank #stageDown').remove();
                                       setTimeout(function(){everytime()},1000)
                                     }});
  
}

function everytime(){
  $(".tank").everyTime(50, 'tank_timer', function(i) {
    movement_other_obj();
    control_my_tank('tank1', control_tank1, pressed);
    if(label_two_players){control_my_tank('tank2', control_tank2, pressed2);}
  })
}

function standart(list_obj, index){
  for(var i in list_obj)
    {
      if(i)
        {
          var indx = Number(i) + index;
          remove_old_img(coord_tanks[indx]);
          creation_elem(list_obj[i], list_obj[i].name, coord_tanks[indx]);
        }
    }
}  

function angle_to_vector(ang){
  var ang = ang * Math.PI / 180;
  return [Math.round(Math.cos(ang)), Math.round(Math.sin(ang))];
}

function movement_other_obj(){
    $(".tank img[id='auto']").each(function(i,elem) 
      {
        var dir;
        var name_elem = $(elem).attr('name');
        var speed = Number($(elem).data('speed'));
        var angle = Number(elem.style.transform.replace(re,''));
        var pos_elem = [Number(elem.style.left.replace(re,'')), Number(elem.style.top.replace(re,''))];
        if(name_elem.indexOf('enemy_tank') != -1 && name_elem.indexOf('missile') == -1)
          {
            missile_pos(elem,name_elem)     
          }
        var forward = angle_to_vector(angle);
        elem.style.top = pos_elem[1] - speed*forward[0] + 'px';
        elem.style.left = pos_elem[0] + speed*forward[1] + 'px';
        if(forward[1] == 0){dir='top'}
        if(forward[0] == 0){dir='left'}
        border(elem,dir);
        other_border(elem);
      })//end each
}

function missile_pos(elem,name_elem){
  if(!$(".tank img").is("[name=missile_"+name_elem+"]") && $(elem).data('shot'))
    {
      $(elem).data('shot',false);
      var time_sec = 2000;
      if($(elem).data('type') == 'tank'){time_sec = 50}
      setTimeout(function(){
        if($(elem).data('speed'))
          {
            $(elem).data('shot',true);
            var missile_angle = Number(elem.style.transform.replace(re,''));
            var seepd_missile = Number($(elem).data('speed'))+5;
            var forward = angle_to_vector(missile_angle);
            var pos_tank = [Number(elem.style.left.replace(re,'')), Number(elem.style.top.replace(re,''))];
            var pos_missile = [pos_tank[0] + size/2 - size_missile[0]/2 + size/2 * forward[1], pos_tank[1] + size/2 - size_missile[1]/2 - size/2 * forward[0]];
            var name = missile.name+"_"+name_elem;
            $(elem).after("<img id='"+missile.type+"' name='"+name+"' src='/static/img/missile.png'>")
            $("img[name='"+name+"']").css({'width':size_missile[0], 'height':size_missile[1], 'left':pos_missile[0] + 'px','top':pos_missile[1] + 'px','transform':'rotate('+missile_angle+'deg)'});
            $("img[name='"+name+"']").data({'speed':seepd_missile, 'creat':true, 'type':missile.type});
            if(name_elem.lastIndexOf('tank') == 0 && $(elem).data('life')>2)
              {
                $("img[name='"+name+"']").data('armor_piercing', true)
              }
        }
      },time_sec)
    }
}

function game_over(){
  label_game_over = true;
  $('.tank img[name^="tank"]').data('speed', 0);
  var width_img = size * 3;
  $('.tank').append("<img id='game_over' name='game_over' width="+width_img+" src='/static/img/game_over.png' >");
  $('#game_over').css({'left':'50%', 'top':'100%', 'z-index':3, 'margin-left':(-width_img/2)+'px'});
  $('#game_over').animate({top:'40%'},
                          {duration:3000, 
                           easing:"linear", 
                           complete:function(){
                               setTimeout(function(){result_of_the_game()},1000)
                             }
                          })
}

function result_of_the_game(){
  $('.tank br').remove();
  $('.tank img').each(function(i,elem){
      if($(elem).is("[name^='tank']")){$(elem).hide()}
      else{$(elem).remove()}
    });
  var width;
  var sum_score_tank1 = 0, sum_score_tank2 = 0;
  $('.tank').append("\
  <table id='score' style='font-size:"+(size/2)+"px'>\
    <tr><td colspan='7'><font color='#d92800'>HI-SCORE</font>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font color='#ff9b3d'>"+HI+"</font>\
      </td></tr>\
    <tr><td colspan='7'>STAGE&nbsp;"+stage+"\
      </td></tr>\
    <tr>\
      <td colspan='2' align='right' width='30%'><font color='#d92800'>&#8544;-PLAYER</font></td>\
      <td  colspan='3' width='40%'></td>\
      <td id='player2' align='right' colspan=2' width='30%'></td>\
    </tr>\
    <tr>\
      <td id='scope_1_player' align='right' colspan='2'><font color='#ff9b3d'>"+score_tank1.score+"</font></td>\
      <td  colspan='3'></td>\
      <td id='scope_2_player' align='right' colspan='2'></td>\
    </tr>\
    </table>\
  ");
  var score = 100;
  for(var i in list_all_enemy_tank)
    {
      var score_player2;
      if(label_two_players)
        {
          score_player2 = "<td align='right'>"+score_tank2[score]+"</td>\
                           <td align='right'>"+(score_tank2[score]*score)+"&nbsp;</td>\
                           <td align='left' width='10%'>&nbsp;PTS</td>";
        }
      else{score_player2 = "<td colspan='3'></td>"}
      $('#score').append("<tr style='font-size:"+(size/2.3)+"px'>\
                            <td align='right'>"+(score_tank1[score]*score)+"&nbsp;</td>\
                            <td align='left' width='10%'>&nbsp;PTS</td>\
                            <td align='right'>"+score_tank1[score]+"</td>\
                            <td width='15%'><img width="+(size/3)+" src='/static/img/left.png'/>\
                              <img width="+(size/1.5)+" src='/static/img/"+(list_all_enemy_tank[i].name)+".png'/>\
                              <img hidden width="+(size/3)+" src='/static/img/right.png'>\
                            </td>\
                            "+score_player2+"\
                          </tr>");
      score += 100;
    }
  for(var i in score_tank1)
    {
      if(Number(i))
        {sum_score_tank1 += score_tank1[i];}
    }
  $('#score').append("<tr>\
                        <td colspan='2'></td>\
                        <td colspan='3' style='width: 40%;height: "+(Math.round(size/20))+"px;background: #fff;'></td>\
                        <td colspan='2'></td>\
                      </tr>\
                      <tr style='font-size:"+(size/2)+"px;'>\
                        <td colspan='2'>TOTAL</td>\
                        <td align='right'>"+sum_score_tank1+"</td>\
                        <td></td>\
                        <td id='sum_score_tank2' align='right'></td>\
                        <td colspan='2'></td>\
                      </tr>")
  if(label_two_players)
    {
      $('#score img:hidden').show();
      $('#player2').append("<font color='#d92800'>&#8545;-PLAYER</font>");
      $('#scope_2_player').append("<font color='#ff9b3d'>"+score_tank2.score+"</font>");
      for(var i in score_tank2)
        {
          if(Number(i))
            {sum_score_tank2 += score_tank2[i]}
        }
      $('#sum_score_tank2').append(sum_score_tank2);
    }
  setTimeout(function(){
      if(label_game_over)
        {
          stage = 1;
          $('.tank').html('');
          $('.tank').append("<img style='top:20%;left:50%;margin-left:"+(-size_width/4)+"px' width="+(size_width/2)+" src='/static/img/game_over.png'/>");
          setTimeout(function(){headband()},2000)
        }
      else
        {
          for(var i in score_tank1){if(Number(i)){score_tank1[i] = 0}}
          for(var i in score_tank2){if(Number(i)){score_tank2[i] = 0}}
          $('.tank').stopTime('tank_timer');
          stage +=1;
          if($('.tank img').is('[name="tank2"]')){show_tank(true)}
          else if($('.tank img').is('[name="tank1"]')){show_tank()}
        }
    },5000)
}
var score_tank1 = {'score':0, 100:0, 200:0, 300:0, 400:0};
var score_tank2 = {'score':0, 100:0, 200:0, 300:0, 400:0};
function del_missile(elem, other_obj){
  var name_elem = $(elem).attr('name');
  var pos_elem = [number(elem.style.left), number(elem.style.top)];
  var pos_explosion = [pos_elem[0]+size_missile[0]/2-size_explosion[0]/2, pos_elem[1]+size_missile[1]/2-size_explosion[1]/2];
  if(other_obj && name_elem.indexOf('missile') != -1)
    {
      var name_other_elem = $(other_obj).attr('name');
      var type_other_obj = $(other_obj).data('type');
      if(!$(other_obj).data('armor'))
        {
          var damage = 1;
          if($(elem).data('armor_piercing')){damage = 2}
          var life_obj = $(other_obj).data('life');
          $(other_obj).data('life', life_obj - damage);
        }
      if(name_other_elem.indexOf('tank') != -1 && name_other_elem.indexOf('missile') == -1)
        {
          creat_after_death = true;
          var starting_pos_tank = [Number($(other_obj).data('pos_left')), Number($(other_obj).data('pos_top'))];
          var rand_index = [Math.floor(Math.random()*list_all_enemy_tank.length)];
          var rand_tank = list_all_enemy_tank[rand_index];
          if(type_other_obj == 'tank')
            {
              if($(other_obj).data('life') <= 0)
                {
                  var count_attempts = $(other_obj).data('count_attempts');
                  $(other_obj).data('count_attempts', count_attempts-1);
                  $('#menu_tank_players div#'+name_other_elem).text($(other_obj).data('count_attempts'));
                  if($('.tank img[name="'+name_other_elem+'"]').data('count_attempts') == 0)
                    {$('.tank img[name="'+name_other_elem+'"]').remove()}
                  else{creation_elem(window[name_other_elem], window[name_other_elem].name, starting_pos_tank, other_obj);}
                  if((!label_two_players && $(other_obj).data('count_attempts') == 0)||
                     (label_two_players && !$(".tank img").is("[name='tank1']") && !$(".tank img").is("[name='tank2']")))
                    {
                      game_over()//game over
                    } 
                }
            }
          else if(name_other_elem.indexOf('enemy_tank') != -1)
            {
              if($(other_obj).data('bonus')){creat_bonus()}
              if($(other_obj).data('life') <= 0)
                {
                  var name_my_tank = name_elem.replace('missile_','');
                  var score_enemy_tank = $(other_obj).data('score');
                  window['score_'+name_my_tank].score += score_enemy_tank;
                  if(window['score_'+name_my_tank].score > 20000){HI = window['score_'+name_my_tank].score}
                  window['score_'+name_my_tank][score_enemy_tank] += 1;
                  creation_elem(rand_tank, name_other_elem, starting_pos_tank, other_obj);
                }
            }
        }
      else if(type_other_obj == 'obstacle' && $(other_obj).data('life') <= 0)
        {
          if(name_other_elem.indexOf('concrete_wall') == -1 || $(elem).data('armor_piercing'))
            {
              var pos_obstacle = [number(other_obj.style.left), number(other_obj.style.top)];
              var ang_missile = number(elem.style.transform);
              var forward = angle_to_vector(ang_missile);
              var pos_neighbor_barrier = [pos_obstacle[0]+Math.abs((SIZE/2)*forward[0]), pos_obstacle[1]+Math.abs((SIZE/2)*forward[1])];
              var pos_popadaniay = [Math.abs(forward[0]*(pos_obstacle[0]-pos_elem[0])), Math.abs(forward[1]*(pos_obstacle[1]-pos_elem[1]))];
              if(pos_popadaniay[0]>SIZE/4 || pos_popadaniay[1]>SIZE/4)
                {
                  if($(elem).data('armor_piercing'))
                    {$(".tank img[id*='obstacle'][style*='left: "+pos_neighbor_barrier[0]+"px; top: "+pos_neighbor_barrier[1]+"px']").remove();}
                  else
                    {$(".tank img[name*='brick_wall'][style*='left: "+pos_neighbor_barrier[0]+"px; top: "+pos_neighbor_barrier[1]+"px']").remove();}
                }
              $(other_obj).remove();
            }
        }
      else if(name_other_elem.indexOf('missile') != -1){explosion(other_obj, pos_explosion)}
      else if(type_other_obj == 'base' && $(other_obj).data('life') <= 0 && !$('.tank img').is('[id="game_over"]'))
        {
          label_construction = false;
          creat_after_death = true;
          creation_elem(base, base.name, coord_tanks[4], other_obj);
          $(other_obj).attr('src', '/static/img/destroyed_base.png');
          game_over()
        }
      explosion(elem, pos_explosion)
    }
  if(name_elem.indexOf('missile') != -1 && !other_obj)
    {
      explosion(elem, pos_explosion)
     }
}

function explosion(elems, pos_explosion){
  $(elems).attr({'name':'explosion', 'src':'/static/img/explosion.gif', 'id':'explosion'}).css({'width':size_explosion[0]+'px', 'height':size_explosion[1]+'px', 'left':pos_explosion[0]+'px', 'top':pos_explosion[1]+'px'});
  setTimeout(function(){$(elems).remove();},200)
}

var control_label, control_label2;
var pressed = [];
var pressed2 = [];
var pause, pauseID;

function runOnKeys(codes, codes2) {
  var single_button_press, single_button_press2;
  document.onkeydown = function(e) {
    e = e || window.event;
    if (e.preventDefault){e.preventDefault();} 
    else{event.returnValue = false;}/* вариант IE<9:*/
    if(e.keyCode == 80 && $('.tank img').is('[id="auto"]'))
      {
        if(!pause)
          {
            $('.tank').stopTime('tank_timer');
            pause = true;
            var width_img = size * 3;
            $('.tank').append("<img id='pause' name='pause' width="+width_img+" src='/static/img/pause.png' >");
            $('#pause').css({'left':'50%', 'top':'40%', 'z-index':3, 'margin-left':(-width_img/2)+'px'});
            pauselID = setInterval( function() 
              { 
                $('#pause').hide();
                setTimeout(function()
                  {
                    $('#pause').show()
                  },600); 
              } , 1000); 
          }
        else if(pause)
          {
            everytime();
            pause = false;
            clearInterval(pauseID);
            $('.tank img#pause').remove();
          }
      }
    if(e.keyCode == 13)//старт
      {
        if(label_starting_stage){start_draw()}
        else if(label_construction){headband();
        /*var d={'stage':'', 'battlefield':f};//создание уровней
        Array.prototype.toString = function() {
          return '[' + this.join(', ') + ']';
        };
        alert(f);//вывод поля боя*/
        }
      }
    if(e.keyCode == 32 && !single_button_press)//выстрел танка 1
    {
      control_label = true;
      single_button_press = true;
      if(label_construction){draw_obstacle();}
    }
    if(e.keyCode == 81 && !single_button_press2)//выстрел танка 2
    {
      control_label2 = true;
      single_button_press2 = true;
    }
    //движение курсора в конструкторе
    if(codes.indexOf(e.keyCode)!=-1 && label_construction && !control_label)
    {
      control_cursor_construction(e.keyCode);
      control_label = true;
    }
    //нажатые кнопки для движения танка 1 или 2
    if(codes.indexOf(e.keyCode)!=-1 && pressed.indexOf(e.keyCode)==-1 && !label_construction)
    {
      pressed[pressed.length]=e.keyCode;
    }
    if(codes2 && codes2.indexOf(e.keyCode)!=-1 && pressed2.indexOf(e.keyCode)==-1 && !label_construction)
    {
      pressed2[pressed2.length]=e.keyCode;
    }
  };

  document.onkeyup = function(e) {
    e = e || window.event;
    if(e.keyCode == 32)
    {
      control_label = false;
      single_button_press = false;
    }
    if(e.keyCode == 81)
    {
      single_button_press2 = false;
    }
    if(codes.indexOf(e.keyCode)!=-1 && label_construction)
    {
      control_label = false;
    }
    if(codes.indexOf(e.keyCode)!=-1)
    {
      for(var i in pressed)
        {
          if(pressed[i]==e.keyCode)
            {pressed.splice(i,1)}
        }
    }
    else if(codes2 && codes2.indexOf(e.keyCode)!=-1)
    {
      for(var i in pressed2)
        {
          if(pressed2[i]==e.keyCode)
            {pressed2.splice(i,1)}
        }
    }
  };
}


function control_my_tank(name, control_tank, pressed_button){
  var elem = document.images[name];
  if(!elem || !$(elem).data('speed')){return}
  var button = pressed_button[pressed_button.length-1];
  if(name=='tank1' && control_label){missile_pos(elem, name);control_label = false;}
  if(name=='tank2' && control_label2){missile_pos(elem, name);control_label2 = false;}
  if(pressed_button.length && $(elem).data('label_movement'))
    {
      var src_tank = $(elem).attr('src');
      $(elem).attr('src', src_tank.replace('.png', '.gif'))
      $(elem).data('label_movement', false);
    }
  if(!pressed_button.length && !$(elem).data('label_movement'))
    {
      src_tank = $(elem).attr('src');
      $(elem).attr('src', src_tank.replace('.gif', '.png'));
      $(elem).data('label_movement', true);
    }
  var angl = number(elem.style.transform); 
  var pos_tank = [number(elem.style.left), number(elem.style.top)];//alert(name+control_tank,pressed_button)
  switch(button) {
    case control_tank[0]: // влево
      handler_turns_movements(elem, pos_tank, angl, 270, 'left', name);
      break;
    case control_tank[1]: // вверх
      handler_turns_movements(elem, pos_tank, angl, 0, 'top', name)
      break;
    case control_tank[2]: // вправо
      handler_turns_movements(elem, pos_tank, angl, 90, 'left', name)
      break;
    case control_tank[3]: // вниз
      handler_turns_movements(elem, pos_tank, angl, 180, 'top', name)
      break;
  }//end switch
//document.getElementById('coords').innerHTML = 
}

var yi={},xi={};
function handler_turns_movements(elem, pos_tank, old_angl, new_angl, axis, name){
  var size  = number(elem.style.width)
  var pos_x = pos_tank[0] % (size/2);
  var pos_y = pos_tank[1] % (size/2);
  var speed = Number($(elem).data('speed'));
  var forward_old = angle_to_vector(old_angl);
  var forward_new = angle_to_vector(new_angl);
  if(pos_y == 0){yi[name] = pos_tank[1]}
  if(pos_x == 0){xi[name] = pos_tank[0]}
  if(old_angl == new_angl)
    {
      elem.style.top = pos_tank[1] - speed*forward_old[0] + 'px';
      elem.style.left = pos_tank[0] + speed*forward_old[1] + 'px';
      if($(".tank img").is("[name*='armor_tank_"+name+"']") && $(elem).data('armor'))
        {
          obj_bonus_armor = document.images['armor_tank_'+name];
          obj_bonus_armor.style.top = elem.style.top;
          obj_bonus_armor.style.left = elem.style.left;
        }
      border(elem, axis);
      other_border(elem);
    }
  else
    {
      $(elem).rotate({angle:new_angl});
      if(Math.abs(old_angl - new_angl)!=180)
        {
          if(pos_y != 0 && Math.abs(pos_tank[1] - yi[name]) > size / (speed * 2))
            {
              elem.style.top = yi[name] - size / 2 * forward_old[0] + 'px';
            }
          else if(pos_y != 0 && Math.abs(pos_tank[1] - yi[name]) < size / (speed * 2))
            {
              elem.style.top = yi[name] + 'px';
            }
          if(pos_x != 0 && Math.abs(pos_tank[0] - xi[name]) > size / (speed * 2))
            {
              elem.style.left = xi[name] + size / 2 * forward_old[1] + 'px';
            }
          else if(pos_x != 0 && Math.abs(pos_tank[0] - xi[name]) < size / (speed * 2))
            {
              elem.style.left = xi[name] + 'px';
            }
          }
    }
}




function random_angle(elem, other_obj){
  var name_elem = $(elem).attr('name');
  if(name_elem.indexOf('enemy_tank') != -1 && name_elem.indexOf('missile') == -1 && !$(elem).data('label_rotate'))
    {
      $(elem).data('label_rotate', true)
      var name, timeShot = 0, arrey = [0,90,180,270];
      if(other_obj) {name= $(other_obj).attr('name');}
      if(name && (name.indexOf('brick_wall') != -1 ||
         name == 'base' ||
         name.indexOf('river_wall') != -1 ||
         $(other_obj).data('type') == 'tank')
        )
           {timeShot = 5000;}
      if(name && (name.indexOf('enemy_tank') != -1))
        {arrey = [number(elem.style.transform)+180];}
      setTimeout(function(){
        $(elem).data('label_rotate', false)
        var angle = number(elem.style.transform); 
        var pos_tank = [number(elem.style.left), number(elem.style.top)];
        for(var i in arrey)
          {
            if(arrey[i] == angle)
              {
                arrey.splice(i,1);
              }
          }
        var rand_num = [Math.floor(Math.random()*arrey.length)];
        $(elem).rotate({angle:arrey[rand_num]});
        },timeShot);
    }
}

function creat_bonus(){
  var rand_bonus = [Math.floor(Math.random()*bonus.length)];
  var pos_bonus = [Math.floor(Math.random() * (working_size - 0) + 0), Math.floor(Math.random() * (working_size - size - 0) + 0)];
  var mod_pos_bonus = [pos_bonus[0] % (size/2), pos_bonus[1] % (size/2)];
  pos_bonus = [(size/2)-mod_pos_bonus[0]+pos_bonus[0], (size/2)-mod_pos_bonus[1]+pos_bonus[1]];
  $('.tank img[name="bonus"]').remove();
  $('.tank').append("<img id="+bonus[rand_bonus]+" name='bonus' src='/static/img/"+bonus[rand_bonus]+".png'>");
  $('img#'+bonus[rand_bonus]).css({'width':size, 'height':size, 'left':pos_bonus[0]+'px','top':pos_bonus[1]+'px'});
}



var bonus = ['detonation', 'armor', 'armor_base', 'life', 'clock', 'star'];
var label_detonation;
function bonus_tank(my_tank, bonus){
  var name_other_obj = $(bonus).attr('name');
  var name_elem = $(my_tank).attr('name');
  var pos_elem = [number(my_tank.style.left), number(my_tank.style.top)];
  if(name_other_obj=='bonus' && name_elem.lastIndexOf('tank')==0)
    {
      var id_bonus = $(bonus).attr('id');
      if(id_bonus == 'detonation')
        {
          creat_after_death = true;
          $(".tank img[name^='enemy_tank']").each(function(i, detonation_obj) 
            {
              if($(detonation_obj).data('creat'))
                {
                  var score_enemy_tank = $(detonation_obj).data('score');
                  window['score_'+name_elem].score += score_enemy_tank;
                  window['score_'+name_elem][score_enemy_tank] += 1;
                  label_detonation = true;
                  var name_detonation_obj = $(detonation_obj).attr('name');
                  var random_tank = list_all_enemy_tank[Math.floor(Math.random()*list_all_enemy_tank.length)];
                  var starting_pos_detonation_obj = [Number($(detonation_obj).data('pos_left')), Number($(detonation_obj).data('pos_top'))];
                  var pos_other_obj = [number(detonation_obj.style.left), number(detonation_obj.style.top)];
                  creation_elem(random_tank, name_detonation_obj, starting_pos_detonation_obj, detonation_obj);
                }
            })
          label_detonation = false;
        }
      else if(id_bonus == 'armor' && !$(my_tank).data('armor'))
        { 
          var name_bonus = 'armor_tank_'+name_elem;
          $('.tank').append("<img name="+name_bonus+" src='/static/img/armor_tank.gif'>");
          $('img[name="'+name_bonus+'"]').css({'width':size, 'height':size, 'left':pos_elem[0]+'px','top':pos_elem[1]+'px'});
          $(my_tank).data('armor',true);
          setTimeout(function()
            {
              $(my_tank).data('armor',false);
              $('img[name="'+name_bonus+'"]').remove();
            },60000)
        }
      else if(id_bonus == 'armor_base')
        {
          var concrete_armor_base = [concrete_wall_right_angle, concrete_wall_bottom, concrete_wall_left_angle, concrete_wall_right, concrete_wall_left];
          standart(concrete_armor_base, 5);
          setTimeout(function()
            {
              if($(".tank img").is("[name='base']"))
                {
                  var brick_armor_base = [brick_wall_right_angle, brick_wall_bottom, brick_wall_left_angle, brick_wall_right, brick_wall_left];
                  standart(brick_armor_base, 5);
                }
            },60000)
        }
      else if(id_bonus == 'life')
        {
          var life_tank = $(my_tank).data('count_attempts');
          $(my_tank).data('count_attempts', life_tank+1);
          $('#menu_tank_players div#'+name_elem).text($(my_tank).data('count_attempts'));
        }
      else if(id_bonus == 'star' && $(my_tank).data('life') < 3)
        {
          $(my_tank).attr('src','/static/img/super_'+name_elem+'.gif');
          var life_tank = $(my_tank).data('life');
          $(my_tank).data('life', life_tank+1);
          var speed_tank = $(my_tank).data('speed');
          $(my_tank).data('speed', speed_tank+1);
        }
      else if(id_bonus == 'clock')
        {
          stop_enemy_tank = true; 
          $(".tank img[name^='enemy_tank']").data('speed', 0);
          setTimeout(function()
            {
              stop_enemy_tank = false;
            },30000)
        }
      $(bonus).remove();
    }
}

function other_border(elem){
  var min_distance = working_size;
  var mins = working_size;
  var name_elem = $(elem).attr('name');
  $(".tank img[name!='"+name_elem+"']").each(function(i,other_obj) 
    {
    var name_other_obj = $(other_obj).attr('name');
    var pos_elem = [number(elem.style.left), number(elem.style.top)];
    pos_other_obj = [number(other_obj.style.left), number(other_obj.style.top)];
    if(name_other_obj && name_elem.indexOf('missile') == -1 && name_elem.indexOf('tank') != -1 && name_other_obj.indexOf('missile') == -1 && name_other_obj.indexOf('tank') != -1 && name_other_obj.indexOf('armor_tank_') == -1)
      {
        var x_distance = pos_elem[0] - pos_other_obj[0]
        var y_distance = pos_elem[1] - pos_other_obj[1]
        var distance = Math.sqrt(x_distance*x_distance + y_distance*y_distance)
        if(min_distance > distance)
          {
            min_distance = distance;
          }
      }
    if(
    (name_other_obj && name_other_obj.indexOf('explosion') == -1 && name_other_obj.indexOf('forest') == -1) && 
    ((name_elem.indexOf('missile_enemy_tank') != -1 && name_other_obj.indexOf('enemy_tank') == -1 && name_other_obj.indexOf('river_wall') == -1 && $(other_obj).data('creat'))||
    (name_elem.lastIndexOf('missile_tank')==0 && name_other_obj.lastIndexOf('tank')!=0 && name_other_obj.indexOf('river_wall') == -1 && $(other_obj).data('creat'))||
    (name_elem.lastIndexOf('enemy_tank')==0 && name_other_obj.indexOf('missile') == -1 && ($(elem).data('creat') || $(other_obj).data('type')=='obstacle') && $(other_obj).data('creat'))||
    (name_elem.lastIndexOf('tank')==0 && name_other_obj.lastIndexOf('missile')!=0 && ($(other_obj).data('creat') || name_other_obj=='bonus') && ($(elem).data('creat')||$(other_obj).data('type')=='obstacle')))
    )
      {
          var size_elem  = [Number(elem.style.width.replace(re,'')), Number(elem.style.height.replace(re,''))];
          var angle = Number(elem.style.transform.replace(re,''));
          var size_other_obj = [Number(other_obj.style.width.replace(re,'')), Number(other_obj.style.height.replace(re,''))];
          var average_size = [(size_other_obj[0] + size_elem[0])/2, (size_other_obj[1] + size_elem[1])/2];
          var pos_left = Math.abs((average_size[0] + (pos_other_obj[0] - size_elem[0])) - pos_elem[0]);
          var pos_top = Math.abs((average_size[1] + (pos_other_obj[1] - size_elem[1])) - pos_elem[1]);
          switch(angle) {
            case 90://вправо
              if(pos_left < average_size[0] && pos_top < average_size[1])
                {
                  
                  elem.style.left = pos_other_obj[0] - size_elem[0] + 'px';
                  bonus_tank(elem, other_obj);
                  random_angle(elem, other_obj);
                  del_missile(elem, other_obj)
                }
              break;
            case 270://влево
              if(pos_left < average_size[0] && pos_top < average_size[1])
                {
                  
                  elem.style.left = pos_other_obj[0] + size_other_obj[0] + 'px';
                  bonus_tank(elem, other_obj);
                  random_angle(elem, other_obj);
                  del_missile(elem, other_obj);
                }
              break;
            case 0://вверх
              if(pos_top < average_size[1] && pos_left < average_size[0])
                {
                  
                  elem.style.top = pos_other_obj[1] + size_other_obj[1] + 'px';
                  bonus_tank(elem, other_obj);
                  random_angle(elem, other_obj);
                  del_missile(elem, other_obj);
                }
              break; 
            case 180://вниз
              if(pos_top < average_size[1] && pos_left < average_size[0])
                {
                  
                  elem.style.top = pos_other_obj[1] - size_elem[1] + 'px';
                  bonus_tank(elem, other_obj);
                  random_angle(elem, other_obj);
                  del_missile(elem, other_obj);
                }
              break;            
            }//end switch 
    }});// end each
    if(min_distance >= size && $(elem).data('speed') && !$(elem).data('creat'))
    {
      if(stop_enemy_tank){$(elem).data('speed',0)}
      $(elem).data('creat', true)
    }
}

 
function border(elem,direct){
  var size_elem = number(elem.style.width);
  var pos_elem = [number(elem.style.left), number(elem.style.top)];
  if(pos_elem[0] < 0 || pos_elem[1] < 0)
    {
      elem.style[direct] = '0px';
      random_angle(elem);
      del_missile(elem);
    }
  if(size_width - size_elem < pos_elem[0] || size_width - size_elem < pos_elem[1])
    {
      elem.style[direct] = size_width - size_elem +'px';
      random_angle(elem);
      del_missile(elem);
    }
}

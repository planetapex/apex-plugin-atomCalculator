create or replace package pkg_atomCalc is

  -- Author  : M Yasir Ali Shah
  -- Created : 16/4/2017 12:14:13 AM
  -- Purpose : 
  FUNCTION f_render_calculator(p_dynamic_action IN apex_plugin.t_dynamic_action,
                p_plugin         IN apex_plugin.t_plugin)
    RETURN apex_plugin.t_dynamic_action_render_result;

end pkg_atomCalc;
/
create or replace package body pkg_atomCalc is

  FUNCTION f_render_calculator(p_dynamic_action IN apex_plugin.t_dynamic_action,
                p_plugin         IN apex_plugin.t_plugin)
    RETURN apex_plugin.t_dynamic_action_render_result AS
    --V_APP_ID  APEX_APPLICATIONS.APPLICATION_ID%TYPE := apex_application.g_flow_id;
    --V_PAGE_ID APEX_APPLICATION_PAGES.PAGE_ID%TYPE := apex_application.g_flow_step_id;
    -- Application Plugin Attributes 
   
    -- DA Plugin Attributes 
     subtype attr is p_dynamic_action.attribute_01%type;
    atr_view           attr := p_dynamic_action.attribute_01;
    atr_show_icon      attr := p_dynamic_action.attribute_02;
    atr_icon           attr := p_dynamic_action.attribute_03;
    atr_position       attr := p_dynamic_action.attribute_04;
    atr_text_alignment attr := p_dynamic_action.attribute_05;
    atr_theme          attr := p_dynamic_action.attribute_06;
    atr_button_style   attr := p_dynamic_action.attribute_07;
    atr_show_method    attr := p_dynamic_action.attribute_08;
    atr_offset         attr := p_dynamic_action.attribute_09;
    atr_keyboard_nav   attr := p_dynamic_action.attribute_10;
    --atr_clear_key      attr := p_dynamic_action.attribute_11;
    --atr_plsmns_key     attr := p_dynamic_action.attribute_12;
    --atr_perc_key       attr := p_dynamic_action.attribute_13;
    atr_read_only      attr := p_dynamic_action.attribute_14;
  
    -- Return 
    l_result apex_plugin.t_dynamic_action_render_result;
    -- Other variables 
    
   
    l_js_code varchar2(32767);
    --affected Elements
    ----------------------------------------
    l_elm_selector varchar2(1000);
 
  
    --Options for the plugin
    ---------------------------------------
    v_list clob;
  
    -- Convert Y/N to True/False (text) 
    -- Default to true 
    FUNCTION f_yn_2_truefalse_str(p_val IN VARCHAR2) RETURN VARCHAR2 AS
    BEGIN
      RETURN case NVL(p_val, 'N') when 'Y' then 'true' else 'false' end;
    END f_yn_2_truefalse_str;
    
   FUNCTION f_yn_2_truefalse(p_val IN VARCHAR2) RETURN boolean AS
    BEGIN
      RETURN case NVL(p_val, 'N') when 'Y' then true else false end;
    END f_yn_2_truefalse;
    
  
  BEGIN
    -- Debug information (if app is being run in debug mode) 
    IF apex_application.g_debug THEN
      apex_plugin_util.debug_dynamic_action(p_plugin         => p_plugin,
                                            p_dynamic_action => p_dynamic_action);
    END IF;
    ---Source Content Generation
    --Initial code to load if any
    -- apex_javascript.add_onload_code(p_code => l_js_code);
    -- l_js_code := '';
    --initial JS & CSS files/libraries to load
    -- p_plugin.file_prefix / apex_application.g_image_prefix || 'libraries/
    apex_javascript.add_library(p_name           => 'jcalculator',
                                p_directory      => apex_application.g_image_prefix ||
                                                    'libraries/calc/',
                                p_version        => NULL,
                                p_skip_extension => FALSE);
    apex_javascript.add_library(p_name           => 'atomCalculator',
                                p_directory      => apex_application.g_image_prefix ||
                                                    'libraries/calc/',
                                p_version        => NULL,
                                p_skip_extension => FALSE);
    apex_css.add_file(p_name      => 'jcalculator',
                      p_directory => apex_application.g_image_prefix ||
                                     'libraries/calc/');
    ---Generationg Options
    --====================================================
    v_list := apex_javascript.add_attribute('displayMode', atr_view);
    v_list := v_list ||
              apex_javascript.add_attribute('showIcon', 
              f_yn_2_truefalse(atr_show_icon));
    v_list := v_list || apex_javascript.add_attribute('icon', atr_icon);
    v_list := v_list ||
              apex_javascript.add_attribute('position', atr_position);
    v_list := v_list ||
              apex_javascript.add_attribute('textAlignment',
                                            atr_text_alignment);
    v_list := v_list || apex_javascript.add_attribute('theme', atr_theme);
     v_list := v_list || apex_javascript.add_attribute('buttonStyle', atr_button_style);
  
    v_list := v_list ||
              apex_javascript.add_attribute('showMethod', atr_show_method);  
    v_list := v_list || apex_javascript.add_attribute('offset', atr_offset);  
    v_list := v_list ||
              apex_javascript.add_attribute('keyboardNav',  f_yn_2_truefalse(atr_keyboard_nav));
  /*  v_list := v_list ||
              apex_javascript.add_attribute('clearKey', atr_clear_key);
    v_list := v_list ||
              apex_javascript.add_attribute('plsmnsKey', atr_plsmns_key);
    v_list := v_list ||
              apex_javascript.add_attribute('percKey', atr_perc_key);  */
   v_list := v_list ||
              apex_javascript.add_attribute('readOnly',  f_yn_2_truefalse(atr_read_only));
    v_list := v_list ||
              apex_javascript.add_attribute('inline', false, false, false);
  
    -- wwv_flow.show_error_message(p_message =>'options' ,p_footer  => v_list);
  
    --if using pex_javascript.add_attribute( then
    --use last parameter combination FALSE (p_omit_null), FALSE (p_add_comma) 
    --so that the last attribute is always generated. This avoids that you 
    --have to check for the other parameters if a trailing comma should be added or not
    /* l_js_code := l_js_code ||
    apex_javascript.add_attribute('content', sys.htf.escape_sc('#' ||
                                                     l_src_id), false, false);*/
    --the Affected Element to which to bind the DA                                             
    SELECT case max(AFFECTED_ELEMENTS_TYPE_CODE)
             WHEN 'ITEM' THEN
              max(APEX_PLUGIN_UTIL.PAGE_ITEM_NAMES_TO_JQUERY(aapda.AFFECTED_ELEMENTS))
            /* WHEN 'BUTTON' THEN
              max('#' ||
                  nvl(aapb.button_static_id, 'B' || aapda.affected_button_id))*/
             WHEN 'REGION' THEN
              max('#' ||
                  nvl(aapr.STATIC_ID, 'R' || aapda.affected_button_id))
             WHEN 'JQUERY_SELECTOR' THEN
              max(aapda.AFFECTED_ELEMENTS)
           end as static_id
      INTO l_elm_selector
      FROM apex_application_page_da_acts aapda,
           apex_application_page_regions aapr,
           apex_application_page_items   aapi
      --  ,apex_application_page_buttons aapb
     WHERE aapda.action_id = p_dynamic_action.ID
          -- AND aapda.application_id = 104
       AND aapda.affected_region_id = aapr.region_id(+)
       and aapda.affected_elements = aapi.item_name(+);
     --  and aapda.affected_button_id = aapb.button_id(+);
    
    --add some class directly or set any option 
    /* IF atr_aff_el_style is not null then
      l_elm_code := '$(''' || l_elm_selector || ''').addClass(''' ||
                    'btn-toolbar-' || atr_aff_el_style || ''');';
    end if;*/
    l_js_code := 'apex.jQuery(''' || l_elm_selector ||
                 ''').atomCalculator({' || v_list || '});';
 
    apex_javascript.add_onload_code(p_code => l_js_code);
    l_result.javascript_function := 'function (){ ' || l_js_code ||
                                    '; apex.da.resume( this.resumeCallback, false );}';
    RETURN l_result;
  END f_render_calculator;

  

end pkg_atomCalc;
/

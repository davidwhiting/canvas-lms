/*
 * Copyright (C) 2011 - present Instructure, Inc.
 *
 * This file is part of Canvas.
 *
 * Canvas is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, version 3 of the License.
 *
 * Canvas is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License along
 * with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import I18n from 'i18n!link_enrollment'
import $ from 'jquery'
import './jquery.ajaxJSON'
import './jquery.instructure_forms' /* formSubmit */
import 'jqueryui/dialog'
import './jquery.instructure_misc_plugins' /* showIf */
import './jquery.templateData' /* fillTemplateData */

  /*global link_enrollment*/
  window.link_enrollment = (function() {
    return {
      choose: function(user_name, enrollment_id, current_user_id, callback) {
        var $user = $(this).parents(".user");
        var $dialog = $("#link_student_dialog");
        var user_data = {};
        user_data.short_name = user_name;
        $dialog.fillTemplateData({data: user_data});
        $dialog.data('callback', callback);
        if(!$dialog.data('loaded')) {
          $dialog.find(".loading_message").text(I18n.t('messages.loading_students', "Loading Students..."));
          $dialog.find(".student_options option:not(.blank)").remove();
          var url = $dialog.find(".student_url").attr('href');
          $.ajaxJSON(url, 'GET', {}, data => {
            for(var idx in data) {
              var user = data[idx];
              var $option = $("<option/>");
              if(user.id && user.name) {
                $option.val(user.id).text(user.name);
                $dialog.find(".student_options").append($option);
              }
            }
            var $option = $("<option/>");
            $option.val("none").text(I18n.t('options.no_link', "[ No Link ]"));
            $dialog.find(".student_options").append($option);

            $dialog.find(".loading_message").hide().end()
              .find(".students_link").show();

            link_enrollment.updateDialog($dialog, enrollment_id, current_user_id)

            $dialog.data('loaded', true);
          }, () => {
            $dialog.find(".loading_message").text(I18n.t('errors.load_failed', "Loading Students Failed, please try again"));
          });
        } else {
          link_enrollment.updateDialog($dialog, enrollment_id, current_user_id)
        }
        $dialog.find(".existing_user").showIf(current_user_id);

        $dialog
          .dialog({
            title: I18n.t('titles.link_to_student', "Link to Student"),
            width: 400
          });
      },
      updateDialog: function($dialog, enrollment_id, current_user_id) {
        $dialog.find(".enrollment_id").val(enrollment_id);
        $dialog.find(".existing_user").showIf(current_user_id);
        $dialog.find(".student_options").val("none").val(current_user_id);

        var user_data = {};
        user_data.existing_user_name = $dialog.find(".student_options option[value='" + current_user_id + "']").first().text();
        $dialog.fillTemplateData({data: user_data});
      }
    };
  })();
  $(document).ready(function() {
    $(document).bind('enrollment_added', () => {
      $("#link_student_dialog").data('loaded', false);
    });
    $("#link_student_dialog .cancel_button").click(() => {
      $("#link_student_dialog").dialog('close');
    });
    $("#link_student_dialog_form").formSubmit({
      beforeSubmit: function(data) {
        $(this)
          .find("button").attr('disabled', true).end()
          .find(".save_button").text(I18n.t('messages.linking_to_student', "Linking to Student..."));
      },
      success: function(data) {
        $(this)
          .find("button").attr('disabled', false).end()
          .find(".save_button").text(I18n.t('buttons.link', "Link to Student"));
        var enrollment = data.enrollment;
        var callback = $("#link_student_dialog").data('callback');
        $("#link_student_dialog").dialog('close');
        if($.isFunction(callback) && enrollment) {
          callback(enrollment);
        }
      },
      error: function(data) {
        $(this)
          .find("button").attr('disabled', false)
          .find(".save_button").text(I18n.t('errors.link_failed', "Linking Failed, please try again"));
      }
    });
  });

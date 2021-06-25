({
    getAuditTrail: function(cmp, event, helper) {
        cmp.set("v.showSpinner", true);

        var searchDate = cmp.get("v.searchDate") ? cmp.get("v.searchDate") : null;
        var searchUser = cmp.get("v.searchUser") ? cmp.get("v.searchUser") : null;
        var action = cmp.get("c.getMetadataAudit");

        action.setParams({
            "searchDate": searchDate,
            "searchUser": searchUser
        });

        action.setCallback(this, function(response) {

            var state = response.getState();
            if (state === "SUCCESS") {
                var responseDTO = response.getReturnValue();
                if (responseDTO) {
                    let resp = JSON.parse(responseDTO);
                    //console.log("R: ", resp);
                    if (resp.status == "success") {
                        let table = [];

                        const map1 = new Map();

                        try {
                            resp.data.forEach(item => {
                                item.Display = item.Display.substr(0, 100);
                                item.CreatedById = item.CreatedBy ? item.CreatedBy.Email : item.CreatedById;
                                map1.set(item.CreatedById + "-" + item.Action + "-" + item.Display, item);
                            });

                            map1.forEach((values, keys) => {
                                table.push(values);
                            })
                        } catch (error) {
                            console.error(error);
                        }
                        //console.log("R: ", table);
                        cmp.set("v.data", table);
                        cmp.set("v.displayTable", true);
                        cmp.set("v.totalNumberOfRows", table.length);
                        cmp.set('v.isReady', true);
                        cmp.set("v.showSpinner", false);
                    } else {
                        cmp.set('v.showSpinner', false);
                        $A.get('e.force:showToast').setParams({ title: 'error', type: 'error', message: resp.message }).fire();
                    }
                }
            } else if (state === "ERROR") {
                cmp.set('v.showSpinner', false);
                helper.handleError(cmp, helper, response);
            }
            cmp.set('v.isReady', true);
            cmp.set("v.showSpinner", false);
        });
        $A.enqueueAction(action);
    },

    handleError: function(cmp, helper, response) {

        var errors = JSON.parse(JSON.stringify(response.getError()));
        var msg = 'ERROR';
        if (errors) {
            if (errors[0] && errors[0].fieldErrors && errors[0].fieldErrors[0]) {
                msg = errors[0].fieldErrors[0].message;

            } else if (errors[0] && errors[0].pageErrors && errors[0].pageErrors[0]) {
                msg = errors[0].pageErrors[0].message;
            } else if (errors[0] && errors[0].message) {
                msg += ' ' + errors[0].message;
            }

            if (msg.includes("FIELD_CUSTOM_VALIDATION_EXCEPTION,")) {
                let splitMsg = msg.split("FIELD_CUSTOM_VALIDATION_EXCEPTION,");
                if (splitMsg && splitMsg.length > 1) {
                    msg = splitMsg[1];
                    msg = msg.replace(": []", "");
                }
            }

            console.log("Error message: " + msg);
            $A.get('e.force:showToast').setParams({ title: 'error', type: 'error', message: msg }).fire();
            console.log("Error object: ", errors);
        } else {
            console.log("Unknown error");
        }
    },
})
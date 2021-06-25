({
    doInit: function(cmp, event, helper) {
        console.log('Loading');
        helper.getAuditTrail(cmp, event, helper);
    },
    searchByDate: function(cmp, event, helper) {
        let searchDate = cmp.get("v.searchDate");
        if (searchDate) {
            helper.getAuditTrail(cmp, event, helper);
        }
    },
    searchByUser: function(cmp, event, helper) {
        let searchUser = cmp.get("v.searchUser");
        if (searchUser) {
            helper.getAuditTrail(cmp, event, helper);
        }
    },
})
public with sharing class SetupAuditTrailController {

    @AuraEnabled
    public static string getMetadataAudit(String searchUser, String searchDate){
        List<SObject> data = null; 
        String status = 'success', message='Success';
        try {
            searchUSer = String.isNotBlank(searchUser) ? searchUser.trim() : null;
            DateTime dt = String.isNotEmpty(searchDate) ? getDateTimeFromString(searchDate.trim()) : System.now().addDays(-30);
            String q = 'SELECT Id, Action, Section, CreatedDate, CreatedBy.Email, Display FROM SetupAuditTrail ';
            q += ' WHERE CreatedDate >= :dt ';
            q += String.isNotEmpty(searchUser) ? ' AND CreatedBy.Email = :searchUser ' : '';
            q += ' ORDER BY CreatedDate DESC LIMIT 1000 '; 
            System.debug('searchUser: ' + searchUser); 
            System.debug('searchDate: ' + dt); 
            System.debug('Q: ' + q);
            data = Database.query(q);

        } catch (Exception e) {
            status='error';
            message=e.getLineNumber() + '. ' +e.getMessage();
        }
        return JSON.serialize(new Map<String,Object>{'status'=>status, 'message'=>message, 'data'=>data});
    }

    private static DateTime getDateTimeFromString(String dateStr){
        DateTime dateTimeResult = null;
        List<String> splitDate = dateStr.split('-');
        if(splitDate != null && splitDate.size() == 3){
            dateTimeResult = DateTime.newInstance(
                Integer.valueOf(splitDate[0]), 
                Integer.valueOf(splitDate[1]), 
                Integer.valueOf(splitDate[2]), 
                0, 0, 0);
        }
        return dateTimeResult;
    }
}

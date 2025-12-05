// in this file you can append custom step methods to 'I' object
import "./step_definitions/admin/admin.steps"
import "./step_definitions/user/user.steps"

export = function() {
  return actor({

    // Define custom steps here, use 'this' to access default methods of I.
    // It is recommended to place a general 'login' function here.

  });
}

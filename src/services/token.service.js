import {
  MemberToken,
  MemberReset,
  ProjectMemberToken,
  UnauthInvitationTokens,
  AuthInvitationTokens
} from "../models";
import uuidv4 from "uuid/v4";
import moment from "moment";

class Token {
  /**
   * Create register token
   * @param {*} user
   */
  createRegisterToken() {
    const token = uuidv4();
    return token;
  }

  /**
   * Create reset token
   * @param {*} user
   */
  createResetToken(user) {
    const token = uuidv4();
    return MemberReset.create({
      token,
      member_id: user.id,
      status: "created"
      // created_at: moment(),
      // updated_at: moment(),
      // deleted_at: null
    });
  }

  /**
   * Create reset token
   * @param {*} user
   */
  createTokenInviteProject(user) {
    const token = uuidv4();
    return ProjectMemberToken.create({
      token,
      project_member_id: user.id,
      status: "created",
      created_at: moment(),
      updated_at: moment(),
      deleted_at: null
    });
  }

  /**
   * Verify register token
   * @param {*} token
   */
  async verifyRegisterToken(token) {
    return MemberToken.findOne({
      where: {
        token,
        status: "sent"
      }
    })
      .then(result => {
        if (result) {
          return true;
        } else {
          return false;
        }
      })
      .catch(err => {
        throw new Error(err);
      });
  }

  /**
   * Verify reset token
   * @param {*} token
   */
  verifyResetToken(token) {
    return MemberReset.findOne({
      where: {
        token,
        status: "sent"
      }
    })
      .then(result => {
        if (result) {
          const tokenDate = moment(result.get("created_at"));
          const currentDate = moment();
          if (tokenDate.add(1, "days").diff(currentDate, "hour") > 0) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      })
      .catch(err => {
        throw new Error(err);
      });
  }

  /**
   * Update status register token
   * @param {*} token
   * @param {*} status in ['created', 'sent', 'used']
   */
  updateStatusRegisterToken(token, status) {
    return MemberToken.findOne({
      where: {
        token
      }
    })
      .then(result => {
        if (result) {
          return result
            .update({
              token,
              status,
              updated_at: moment()
            })
            .then(result1 => {
              if (result1) {
                return true;
              } else {
                return false;
              }
            });
        } else {
          return false;
        }
      })
      .catch(err => {
        throw new Error(err);
      });
  }

  /**
   * Update status reset password token
   * @param {*} token
   * @param {*} status in ['created', 'sent', 'used']
   */
  updateStatusResetToken(token, status) {
    return MemberReset.findOne({
      where: {
        token
      }
    })
      .then(result => {
        if (result) {
          return result
            .update({
              token,
              status,
              updated_at: moment()
            })
            .then(result1 => {
              if (result1) {
                return true;
              } else {
                return false;
              }
            });
        } else {
          return false;
        }
      })
      .catch(err => {
        throw new Error(err);
      });
  }

  /**
   * Update status of token invite member to project
   * @param {*} token
   * @param {*} status in ['created', 'sent', 'used']
   */
  updateStatusInviteMemberToken(token, status) {
    return ProjectMemberToken.findOne({
      where: {
        token
      }
    })
      .then(result => {
        if (result) {
          return result
            .update({
              token,
              status,
              updated_at: moment()
            })
            .then(result1 => {
              if (result1) {
                return true;
              } else {
                return false;
              }
            });
        } else {
          return false;
        }
      })
      .catch(err => {
        throw new Error(err);
      });
  }

  async createUnauthInvitationToken(
    email,
    space_id,
    project_id,
    space_team_id
  ) {
    const token = uuidv4();

    return await UnauthInvitationTokens.create({
      token,
      email,
      space_id,
      project_id,
      space_team_id
    });
  }

  async updateUnauthInvitationToken(token, status, previous_status) {
    let total = await UnauthInvitationTokens.update(
      {
        status
      },
      {
        where: {
          token,
          status: previous_status
        }
      }
    );

    return total[0];
  }

  async createAuthInvitationToken(
    member_id,
    space_id,
    project_id,
    space_team_id
  ) {
    const token = uuidv4();

    return await AuthInvitationTokens.create({
      token,
      member_id,
      space_id,
      project_id,
      space_team_id
    });
  }

  async updateAuthInvitationToken(token, status, previous_status) {
    let total = await AuthInvitationTokens.update(
      {
        status
      },
      {
        where: {
          token,
          status: previous_status
        }
      }
    );

    return total[0];
  }

  async getInvitationToken(token) {
    let invitation_token, is_auth;

    // check unauth
    invitation_token = await UnauthInvitationTokens.findOne({
      where: {
        token
      }
    });

    if (invitation_token) {
      is_auth = false;

      return {
        is_auth,
        invitation_token
      };
    }

    // check auth
    invitation_token = await AuthInvitationTokens.findOne({
      where: {
        token
      }
    });

    if (invitation_token) {
      is_auth = true;

      return {
        is_auth,
        invitation_token
      };
    }

    return {
      is_auth,
      invitation_token
    };
  }
}

export default Token;

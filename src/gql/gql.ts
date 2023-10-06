/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n    mutation register($email: String!, $password: String!) {\n      register(email: $email, password: $password) {\n        token\n        id\n      }\n    }": types.RegisterDocument,
    "\n      query GetUser($id: uuid!) {\n        users_by_pk(id: $id) {\n          id\n          email\n          display_name\n          avatar_file_key\n          email_verified\n          created_at\n          updated_at\n        }\n      }\n    ": types.GetUserDocument,
    "\n      mutation Login($email: String!, $password: String!) {\n        login(email: $email, password: $password) {\n          id\n          token\n        }\n      }\n    ": types.LoginDocument,
    "\n      mutation SendPasswordResetEmail($email: String!) {\n        sendPasswordResetEmail(email: $email)\n      }\n    ": types.SendPasswordResetEmailDocument,
    "\n        mutation ResendVerificationEmail {\n          resendVerificationEmail\n        }\n      ": types.ResendVerificationEmailDocument,
    "mutation UpdateDisplayName($id: uuid!, $display_name: String!) {\n        update_users_by_pk(pk_columns: {id: $id}, _set: {display_name: $display_name}) {\n          display_name\n        }\n      }": types.UpdateDisplayNameDocument,
    "mutation RemoveProfilePicture($id: uuid!, $avatar_file_key: String) {\n        update_users_by_pk(pk_columns: {id: $id}, _set: {avatar_file_key: $avatar_file_key}) {\n          avatar_file_key\n        }\n      }": types.RemoveProfilePictureDocument,
    "mutation ChangeEmail($newEmail: String!, $password: String!) {\n        changeEmail(newEmail: $newEmail, password: $password)\n      }": types.ChangeEmailDocument,
    "mutation ChangePassword($newPassword: String!, $oldPassword: String!) {\n        changePassword(newPassword: $newPassword, oldPassword: $oldPassword)\n      }": types.ChangePasswordDocument,
    "mutation DestroyUser($password: String!) {\n        destroyUser(password: $password)\n      }": types.DestroyUserDocument,
    "mutation VerifyEmail($code: String!) {\n      verifyEmail(code: $code)\n    }": types.VerifyEmailDocument,
    "mutation ResetPassword($code: String!, $email: String!, $newPassword: String!) {\n      resetPassword(code: $code, email: $email, newPassword: $newPassword)\n    }": types.ResetPasswordDocument,
    "\n    mutation SubmitContactForm($name: String!, $email: String!, $message: String!) {\n      insert_contact_form_submissions(objects: {email: $email, message: $message, name: $name}) {\n        affected_rows\n      }\n    }\n    ": types.SubmitContactFormDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation register($email: String!, $password: String!) {\n      register(email: $email, password: $password) {\n        token\n        id\n      }\n    }"): (typeof documents)["\n    mutation register($email: String!, $password: String!) {\n      register(email: $email, password: $password) {\n        token\n        id\n      }\n    }"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query GetUser($id: uuid!) {\n        users_by_pk(id: $id) {\n          id\n          email\n          display_name\n          avatar_file_key\n          email_verified\n          created_at\n          updated_at\n        }\n      }\n    "): (typeof documents)["\n      query GetUser($id: uuid!) {\n        users_by_pk(id: $id) {\n          id\n          email\n          display_name\n          avatar_file_key\n          email_verified\n          created_at\n          updated_at\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      mutation Login($email: String!, $password: String!) {\n        login(email: $email, password: $password) {\n          id\n          token\n        }\n      }\n    "): (typeof documents)["\n      mutation Login($email: String!, $password: String!) {\n        login(email: $email, password: $password) {\n          id\n          token\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      mutation SendPasswordResetEmail($email: String!) {\n        sendPasswordResetEmail(email: $email)\n      }\n    "): (typeof documents)["\n      mutation SendPasswordResetEmail($email: String!) {\n        sendPasswordResetEmail(email: $email)\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n        mutation ResendVerificationEmail {\n          resendVerificationEmail\n        }\n      "): (typeof documents)["\n        mutation ResendVerificationEmail {\n          resendVerificationEmail\n        }\n      "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation UpdateDisplayName($id: uuid!, $display_name: String!) {\n        update_users_by_pk(pk_columns: {id: $id}, _set: {display_name: $display_name}) {\n          display_name\n        }\n      }"): (typeof documents)["mutation UpdateDisplayName($id: uuid!, $display_name: String!) {\n        update_users_by_pk(pk_columns: {id: $id}, _set: {display_name: $display_name}) {\n          display_name\n        }\n      }"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation RemoveProfilePicture($id: uuid!, $avatar_file_key: String) {\n        update_users_by_pk(pk_columns: {id: $id}, _set: {avatar_file_key: $avatar_file_key}) {\n          avatar_file_key\n        }\n      }"): (typeof documents)["mutation RemoveProfilePicture($id: uuid!, $avatar_file_key: String) {\n        update_users_by_pk(pk_columns: {id: $id}, _set: {avatar_file_key: $avatar_file_key}) {\n          avatar_file_key\n        }\n      }"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation ChangeEmail($newEmail: String!, $password: String!) {\n        changeEmail(newEmail: $newEmail, password: $password)\n      }"): (typeof documents)["mutation ChangeEmail($newEmail: String!, $password: String!) {\n        changeEmail(newEmail: $newEmail, password: $password)\n      }"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation ChangePassword($newPassword: String!, $oldPassword: String!) {\n        changePassword(newPassword: $newPassword, oldPassword: $oldPassword)\n      }"): (typeof documents)["mutation ChangePassword($newPassword: String!, $oldPassword: String!) {\n        changePassword(newPassword: $newPassword, oldPassword: $oldPassword)\n      }"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation DestroyUser($password: String!) {\n        destroyUser(password: $password)\n      }"): (typeof documents)["mutation DestroyUser($password: String!) {\n        destroyUser(password: $password)\n      }"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation VerifyEmail($code: String!) {\n      verifyEmail(code: $code)\n    }"): (typeof documents)["mutation VerifyEmail($code: String!) {\n      verifyEmail(code: $code)\n    }"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation ResetPassword($code: String!, $email: String!, $newPassword: String!) {\n      resetPassword(code: $code, email: $email, newPassword: $newPassword)\n    }"): (typeof documents)["mutation ResetPassword($code: String!, $email: String!, $newPassword: String!) {\n      resetPassword(code: $code, email: $email, newPassword: $newPassword)\n    }"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation SubmitContactForm($name: String!, $email: String!, $message: String!) {\n      insert_contact_form_submissions(objects: {email: $email, message: $message, name: $name}) {\n        affected_rows\n      }\n    }\n    "): (typeof documents)["\n    mutation SubmitContactForm($name: String!, $email: String!, $message: String!) {\n      insert_contact_form_submissions(objects: {email: $email, message: $message, name: $name}) {\n        affected_rows\n      }\n    }\n    "];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;
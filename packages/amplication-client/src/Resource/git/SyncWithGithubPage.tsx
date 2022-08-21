import { Icon, Snackbar } from "@amplication/design-system";
import { gql, useQuery } from "@apollo/client";
import React, { useContext } from "react";
import { AppContext } from "../../context/appContext";
import PageContent from "../../Layout/PageContent";
import { EnumGitOrganizationType, EnumResourceType, Resource } from "../../models";
import { formatError } from "../../util/error";
import AuthResourceWithGit from "./AuthResourceWithGit";
import ServiceConfigurationGitSettings from "./ServiceConfigurationGitSettings";
import "./SyncWithGithubPage.scss";

const CLASS_NAME = "sync-with-github-page";

export type GitOrganizationFromGitRepository = {
  id: string;
  name: string;
  type: EnumGitOrganizationType;
};

function SyncWithGithubPage() {
  const {currentResource} = useContext(AppContext); 

  const { data, error, refetch } = useQuery<{
    resource: Resource;
  }>(GET_RESOURCE_GIT_REPOSITORY, {
    variables: {
      resourceId: currentResource?.id,
    },
  });

  const pageTitle = "GitHub";
  const errorMessage = formatError(error);
  const isServiceResource =
  data?.resource.resourceType === EnumResourceType.Service;

  return (
    <PageContent pageTitle={pageTitle}>
      <div className={CLASS_NAME}>
        <div className={`${CLASS_NAME}__header`}>
          <Icon icon="github" size="xlarge" />
          <h1>Sync with GitHub</h1>
        </div>
        <div className={`${CLASS_NAME}__message`}>
          Enable sync with GitHub to automatically push the generated code of
          your resource and create a Pull Request in your GitHub repository
          every time you commit your changes.
        </div>
        {data?.resource && !isServiceResource && (
          <AuthResourceWithGit resource={data.resource} onDone={refetch} />
        )}
        {isServiceResource && data?.resource && (
          <ServiceConfigurationGitSettings
            resource={data.resource}
            onDone={refetch}
          />
        )}
        <Snackbar open={Boolean(error)} message={errorMessage} />
      </div>
    </PageContent>
  );
}

export default SyncWithGithubPage;

export const GET_RESOURCE_GIT_REPOSITORY = gql`
  query getResourceGitRepository($resourceId: String!) {
    resource(where: { id: $resourceId }) {
      id
      name
      color
      githubLastSync
      resourceType
      gitRepositoryOverride
      createdAt
      gitRepository {
        id
        name
        gitOrganization {
          id
          name
          type
        }
      }
    }
  }
`;

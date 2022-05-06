import { resolvePackagePath } from '@backstage/backend-common';
import { CompoundEntityRef, stringifyEntityRef } from '@backstage/catalog-model';
import { loadFilesSync } from '@graphql-tools/load-files';
import { createModule } from 'graphql-modules';
import { ResolverContext } from '../../resolver-context';

export const Core = createModule({
  id: 'core',
  typeDefs: loadFilesSync(resolvePackagePath('@frontside/backstage-plugin-graphql', 'src/app/modules/core/core.graphql')),
  resolvers: {
    Lifecycle: {
      EXPERIMENTAL: 'experimental',
      PRODUCTION: 'production',
      DEPRECATED: 'deprecated',
    },
    Node: {
      id: async ({ id }: { id: string }, _: never, { loader }: ResolverContext): Promise<string | null> => {
        const entity = await loader.load(id);
        if (!entity) return null;
        return id;
      },
    },
    Query: {
      node: (_: any, { id }: { id: string }): { id: string } => ({ id }),
      entity: (
        _: any,
        { name, kind, namespace = 'default' }: CompoundEntityRef,
      ): { id: string } => ({ id: stringifyEntityRef({ name, kind, namespace }) }),
    },
  },
});
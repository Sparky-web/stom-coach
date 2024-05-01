import type { Schema, Attribute } from '@strapi/strapi';

export interface ComponentsLink extends Schema.Component {
  collectionName: 'components_components_links';
  info: {
    displayName: 'link';
    icon: 'bulletList';
  };
  attributes: {
    title: Attribute.String;
    href: Attribute.String;
  };
}

export interface ComponentsTags extends Schema.Component {
  collectionName: 'components_components_tags';
  info: {
    displayName: 'tags';
    description: '';
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
  };
}

export interface ComponentsVariants extends Schema.Component {
  collectionName: 'components_components_variants';
  info: {
    displayName: 'variants';
    description: '';
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    price: Attribute.Integer & Attribute.Required;
    ticketsAmount: Attribute.Integer & Attribute.Required;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'components.link': ComponentsLink;
      'components.tags': ComponentsTags;
      'components.variants': ComponentsVariants;
    }
  }
}

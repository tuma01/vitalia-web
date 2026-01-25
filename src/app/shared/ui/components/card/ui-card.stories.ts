import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { UiCardComponent, UiCardHeaderComponent, UiCardContentComponent, UiCardFooterComponent, UiCardTitleDirective, UiCardSubtitleDirective, UiCardImageDirective } from './ui-card.component';
import { UiButtonComponent } from '../../primitives/button/ui-button.component';

const meta: Meta<UiCardComponent> = {
    title: 'PAL/Container (Card)',
    component: UiCardComponent,
    decorators: [
        moduleMetadata({
            imports: [
                CommonModule,
                UiCardHeaderComponent,
                UiCardContentComponent,
                UiCardFooterComponent,
                UiCardTitleDirective,
                UiCardSubtitleDirective,
                UiCardImageDirective,
                UiButtonComponent
            ]
        }),
        (story) => ({
            ...story(),
            template: `<div style="padding: 2rem; background: #f9fafb; min-height: 100vh;">${story().template}</div>`
        })
    ],
};

export default meta;
type Story = StoryObj<UiCardComponent>;

export const Default: Story = {
    render: (args) => ({
        props: args,
        template: `
      <ui-card [variant]="variant" [hoverable]="hoverable" style="width: 350px;">
        <ui-card-header>
            <h3 uiCardTitle>Card Title</h3>
            <span uiCardSubtitle>Secondary text</span>
        </ui-card-header>
        <ui-card-content>
            <p>This is a standard card content. It uses global tokens for padding and radius.</p>
        </ui-card-content>
        <ui-card-footer>
            <button ui-button variant="primary">Action</button>
            <button ui-button variant="ghost" style="margin-left: 8px;">Cancel</button>
        </ui-card-footer>
      </ui-card>
    `,
    }),
};

export const WithImage: Story = {
    render: (args) => ({
        props: args,
        template: `
        <ui-card [variant]="variant" [hoverable]="hoverable" style="width: 350px;">
          <img uiCardImage src="https://picsum.photos/400/200" alt="Random">
          <ui-card-header>
              <h3 uiCardTitle>Beautiful Scenery</h3>
              <span uiCardSubtitle>Nature & Travel</span>
          </ui-card-header>
          <ui-card-content>
              <p>Images automatically dock to the top and remove generic padding. Smart Layout handles the spacing.</p>
          </ui-card-content>
          <ui-card-footer>
              <button ui-button variant="secondary">Share</button>
          </ui-card-footer>
        </ui-card>
      `,
    }),
};

export const Outlined: Story = {
    ...Default,
    args: {
        variant: 'outlined',
        hoverable: true
    }
};

export const GridExample: Story = {
    render: (args) => ({
        props: args,
        template: `
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1rem;">
            <ui-card *ngFor="let i of [1,2,3]" hoverable="true">
                <ui-card-header>
                    <h3 uiCardTitle>Item {{i}}</h3>
                </ui-card-header>
                <ui-card-content>
                    Grid items fit perfectly.
                </ui-card-content>
            </ui-card>
          </div>
        `
    })
};

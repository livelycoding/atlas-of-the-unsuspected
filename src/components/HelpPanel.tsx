import styles from './HelpPanel.module.css';

interface Props {
  onClose: () => void;
}

export function HelpPanel({ onClose }: Props) {
  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h2 className={styles.title}>How to Use</h2>
        <button className={styles.closeBtn} onClick={onClose}>&times;</button>
      </div>
      <div className={styles.body}>
        <Section title="What Is This?">
          <p>
            Atlas of the Unsuspected is a companion tool for the Cultist Simulator: Exile DLC.
            Keep it open alongside your run to track where you've been, plan your route,
            and look up location details at a glance. It works on desktop and mobile.
          </p>
        </Section>

        <Section title="Map & Grid Views">
          <p>
            <strong>Map View</strong> shows locations laid out geographically with connection
            lines between them. <strong>Grid View</strong> shows a compact table layout.
            Toggle between them with the button below the toolbar.
          </p>
        </Section>

        <Section title="Selecting a Location">
          <p>
            Click any city to open the <strong>Detail Panel</strong> on the right.
            It shows everything about that location: connections, on-arrival events,
            opportunities, shrines, pentiments, ligeians, allies, capers, special events,
            weapons, rarities, and Book of Suns pages.
          </p>
        </Section>

        <Section title="Removing Cities">
          <p>
            <strong>Right-click</strong> (or long-press on mobile) a city to mark it as
            removed from your pool. Removed cities appear dimmed and crossed out.
            You can also toggle removal from the detail panel checkbox.
          </p>
        </Section>

        <Section title="Travel & Remove Modes">
          <p>
            Inside the detail panel's Connections section, toggle <strong>Touch Connection
            = Travel</strong> to auto-remove your current city and jump to the next one
            in a single tap. Toggle <strong>Touch Connection = Remove</strong> to remove
            connected cities directly from the list.
          </p>
        </Section>

        <Section title="Opportunity Search">
          <p>
            The search bar above the filters lets you find locations by their reconnoitre
            opportunities. Type to filter, click to select. You can combine up to
            3 terms — locations must have <strong>all</strong> selected opportunities (AND logic).
            Remove chips to relax the filter.
          </p>
        </Section>

        <Section title="Region & Feature Filters">
          <p>
            The bottom legend bar has clickable filters. <strong>Regions</strong> highlight
            locations by geographic area. <strong>Places</strong> filters by shrines, events,
            capers, troubled/remote status. <strong>People</strong> filters by allies and
            ligeians. <strong>Weapons &amp; Key Items</strong> filters by available weapons,
            pentiments, and Book of Suns pages. Active filters combine with opportunity
            search via intersection.
          </p>
        </Section>

        <Section title="Operations Reference">
          <p>
            The <strong>Operations Reference</strong> button in the toolbar opens a quick-reference
            panel listing all operations from the game including their requirements, challenge checks
            at each tier, and rewards. Expand any operation to see its details.
          </p>
        </Section>

        <Section title="Save & Load Your Run">
          <p>
            <strong>Export Removed Cities</strong> saves your removed cities to a JSON file.
            <strong> Import Removed Cities</strong> loads them back. Use this to save your
            progress between sessions or share a run state.
            <strong> Reset Cities</strong> clears all removals (requires a confirmation click).
          </p>
        </Section>

        <blockquote className={styles.quote}>
          <p>
            "This began life as an atlas of the cities of Europe. Over decades it's been
            extended and annotated by a dozen hands - adepts, burglars, soldiers, spies -
            to show secret routes and hiding-nooks."
          </p>
          <cite>~ Rarity: Atlas of the Unsuspected</cite>
        </blockquote>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>{title}</h3>
      {children}
    </div>
  );
}

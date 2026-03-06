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
          <p>
            In the Reconnoitre Opportunities section, click any item to expand a
            <strong> dropdown</strong> showing its result, aspects, and which weakness pool
            it belongs to (if any).
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
            3 terms. Highlighted locations must have <strong>all</strong> selected opportunities (AND logic).
            Remove chips to relax the filter.
          </p>
        </Section>

        <Section title="Weakness Tracker">
          <p>
            The <strong>Remaining Weaknesses</strong> section at the top of the legend
            helps you track the Foe's 3 possible weaknesses. There are 3 pools
            (Environment, Quirks, Disfavor) each with 3 options.
          </p>
          <p>
            <strong>Click</strong> a weakness to eliminate it (struck through and dimmed).
            Click again to restore it.
            <strong> Right-click</strong> (or long-press on mobile) a weakness to keep only
            that one and eliminate the other two in its pool.
          </p>
          <p>
            When you narrow a pool to a single confirmed weakness, locations that offer
            that weakness show a <strong>gold count badge</strong> on the map. Open a
            location's detail panel to see a callout listing the matched weakness names.
            Weakness state is saved with Export and restored with Import.
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
            <strong>Export Run Data</strong> saves your removed cities and weakness tracker
            state to a JSON file. <strong>Import Run Data</strong> loads them back. Use this
            to save your progress between sessions or share a run state.
            <strong> Reset Cities</strong> clears all removals and resets the weakness tracker
            (requires a confirmation click).
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

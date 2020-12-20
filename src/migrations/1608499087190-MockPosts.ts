import { MigrationInterface, QueryRunner } from "typeorm";

export class MockPosts1608499087190 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      insert into post (title, text, "authorId", "createdAt") values ('Total dedicated algorithm', 'productize user-centric interfaces', 10, '2020-12-13T01:00:33Z');
      insert into post (title, text, "authorId", "createdAt") values ('Balanced multi-tasking portal', 'revolutionize viral e-commerce', 10, '2020-12-19T23:30:36Z');
      insert into post (title, text, "authorId", "createdAt") values ('Optional optimal knowledge user', 'expedite B2C mindshare', 11, '2020-01-17T15:12:42Z');
      insert into post (title, text, "authorId", "createdAt") values ('Configurable regional firmware', 'reinvent holistic markets', 10, '2020-12-05T17:03:48Z');
      insert into post (title, text, "authorId", "createdAt") values ('User-friendly homogeneous software', 'optimize vertical mindshare', 11, '2020-02-25T02:49:43Z');
      insert into post (title, text, "authorId", "createdAt") values ('Stand-alone client-server capacity', 'implement global e-business', 10, '2020-01-27T02:46:26Z');
      insert into post (title, text, "authorId", "createdAt") values ('Vision-oriented system-worthy model', 'synthesize enterprise schemas', 10, '2020-07-04T19:37:09Z');
      insert into post (title, text, "authorId", "createdAt") values ('Enhanced foreground firmware', 'synergize dot-com e-services', 12, '2020-01-16T23:34:36Z');
      insert into post (title, text, "authorId", "createdAt") values ('Visionary cohesive product', 'innovate leading-edge models', 10, '2020-08-22T22:33:42Z');
      insert into post (title, text, "authorId", "createdAt") values ('Right-sized fresh-thinking attitude', 'enable leading-edge architectures', 12, '2020-02-14T12:51:33Z');
      insert into post (title, text, "authorId", "createdAt") values ('Automated multi-tasking collaboration', 'envisioneer B2C methodologies', 10, '2020-04-12T07:22:38Z');
      insert into post (title, text, "authorId", "createdAt") values ('Innovative optimal conglomeration', 'incubate customized partnerships', 9, '2020-11-11T11:26:35Z');
      insert into post (title, text, "authorId", "createdAt") values ('User-centric tangible migration', 'extend cross-media action-items', 12, '2020-06-30T10:56:47Z');
      insert into post (title, text, "authorId", "createdAt") values ('Integrated 6th generation matrices', 'maximize world-class eyeballs', 11, '2020-03-05T04:20:20Z');
      insert into post (title, text, "authorId", "createdAt") values ('Automated multi-tasking open system', 'generate dot-com eyeballs', 9, '2020-05-24T01:45:03Z');
      insert into post (title, text, "authorId", "createdAt") values ('Intuitive national model', 'benchmark real-time e-commerce', 11, '2020-08-06T13:00:53Z');
      insert into post (title, text, "authorId", "createdAt") values ('Business-focused stable strategy', 'seize 24/365 infomediaries', 10, '2020-10-30T23:56:23Z');
      insert into post (title, text, "authorId", "createdAt") values ('Front-line local migration', 'aggregate B2C channels', 12, '2020-01-30T04:46:13Z');
      insert into post (title, text, "authorId", "createdAt") values ('Total content-based concept', 'whiteboard collaborative applications', 12, '2020-07-13T09:39:49Z');
      insert into post (title, text, "authorId", "createdAt") values ('User-friendly zero defect migration', 'visualize wireless initiatives', 10, '2020-12-14T22:31:11Z');
      insert into post (title, text, "authorId", "createdAt") values ('Ergonomic fault-tolerant ability', 'integrate transparent metrics', 11, '2020-11-03T07:36:01Z');
      insert into post (title, text, "authorId", "createdAt") values ('Diverse didactic methodology', 'utilize customized initiatives', 12, '2020-04-01T09:04:13Z');
      insert into post (title, text, "authorId", "createdAt") values ('Adaptive bandwidth-monitored emulation', 'evolve turn-key content', 11, '2020-07-18T20:13:32Z');
      insert into post (title, text, "authorId", "createdAt") values ('Enhanced actuating utilisation', 'revolutionize viral interfaces', 9, '2020-10-03T17:00:16Z');
      insert into post (title, text, "authorId", "createdAt") values ('Object-based optimal matrix', 'engage collaborative networks', 11, '2020-10-19T20:20:48Z');
      insert into post (title, text, "authorId", "createdAt") values ('Expanded global benchmark', 'recontextualize bleeding-edge methodologies', 11, '2020-11-15T12:12:30Z');
      insert into post (title, text, "authorId", "createdAt") values ('Future-proofed zero defect time-frame', 'disintermediate vertical portals', 10, '2020-06-25T03:03:38Z');
      insert into post (title, text, "authorId", "createdAt") values ('Multi-layered composite throughput', 'harness one-to-one infomediaries', 11, '2020-01-13T06:03:31Z');
      insert into post (title, text, "authorId", "createdAt") values ('Re-engineered context-sensitive archive', 'engage enterprise supply-chains', 12, '2020-08-14T05:53:33Z');
      insert into post (title, text, "authorId", "createdAt") values ('Networked client-server collaboration', 'drive intuitive e-services', 11, '2020-07-18T06:06:45Z');
      insert into post (title, text, "authorId", "createdAt") values ('Operative optimizing toolset', 'envisioneer plug-and-play networks', 11, '2020-12-10T04:10:06Z');
      insert into post (title, text, "authorId", "createdAt") values ('Distributed zero defect concept', 'synthesize viral solutions', 11, '2020-12-12T05:26:27Z');
      insert into post (title, text, "authorId", "createdAt") values ('Stand-alone value-added definition', 'enhance revolutionary web services', 11, '2020-07-06T20:28:37Z');
      insert into post (title, text, "authorId", "createdAt") values ('Open-architected empowering encoding', 'leverage strategic methodologies', 10, '2020-11-17T01:39:21Z');
      insert into post (title, text, "authorId", "createdAt") values ('Organized background flexibility', 'implement B2C e-commerce', 9, '2020-06-06T16:55:32Z');
      insert into post (title, text, "authorId", "createdAt") values ('Assimilated optimal instruction set', 'innovate scalable e-tailers', 10, '2020-11-06T18:29:53Z');
      insert into post (title, text, "authorId", "createdAt") values ('Quality-focused attitude-oriented conglomeration', 'whiteboard viral metrics', 12, '2020-08-19T16:58:34Z');
      insert into post (title, text, "authorId", "createdAt") values ('Distributed composite customer loyalty', 'optimize impactful communities', 9, '2020-09-27T14:24:33Z');
      insert into post (title, text, "authorId", "createdAt") values ('Cross-group holistic projection', 'innovate synergistic eyeballs', 11, '2020-02-07T10:15:40Z');
      insert into post (title, text, "authorId", "createdAt") values ('Object-based tangible benchmark', 'facilitate enterprise synergies', 9, '2020-08-18T07:26:13Z');
      insert into post (title, text, "authorId", "createdAt") values ('Phased web-enabled interface', 'cultivate magnetic relationships', 12, '2020-08-23T07:18:15Z');
      insert into post (title, text, "authorId", "createdAt") values ('Enterprise-wide multimedia process improvement', 'envisioneer collaborative paradigms', 11, '2020-08-02T18:08:26Z');
      insert into post (title, text, "authorId", "createdAt") values ('Expanded fresh-thinking support', 'envisioneer synergistic partnerships', 12, '2019-12-27T05:46:02Z');
      insert into post (title, text, "authorId", "createdAt") values ('Ameliorated scalable info-mediaries', 'utilize front-end relationships', 10, '2020-10-15T13:42:31Z');
      insert into post (title, text, "authorId", "createdAt") values ('Synergistic full-range access', 'iterate 24/365 supply-chains', 11, '2020-08-15T23:36:45Z');
      insert into post (title, text, "authorId", "createdAt") values ('Object-based client-driven benchmark', 'syndicate dot-com models', 10, '2020-07-09T14:00:52Z');
      insert into post (title, text, "authorId", "createdAt") values ('Profit-focused context-sensitive support', 'syndicate web-enabled content', 12, '2020-03-25T17:46:34Z');
      insert into post (title, text, "authorId", "createdAt") values ('Optimized dynamic methodology', 'reintermediate end-to-end interfaces', 9, '2020-10-25T07:29:35Z');
      insert into post (title, text, "authorId", "createdAt") values ('Multi-tiered grid-enabled analyzer', 'productize sticky eyeballs', 9, '2020-06-25T22:45:25Z');
      insert into post (title, text, "authorId", "createdAt") values ('User-friendly multi-tasking knowledge base', 'recontextualize efficient methodologies', 11, '2020-10-15T12:23:26Z');
      insert into post (title, text, "authorId", "createdAt") values ('Cross-group discrete challenge', 'transform virtual methodologies', 10, '2020-07-08T11:50:51Z');
      insert into post (title, text, "authorId", "createdAt") values ('Versatile responsive orchestration', 'cultivate interactive technologies', 12, '2020-10-18T15:48:33Z');
      insert into post (title, text, "authorId", "createdAt") values ('Programmable uniform website', 'synergize impactful methodologies', 10, '2020-03-26T07:53:19Z');
      insert into post (title, text, "authorId", "createdAt") values ('Business-focused 4th generation workforce', 'strategize enterprise technologies', 12, '2020-07-28T15:24:48Z');
      insert into post (title, text, "authorId", "createdAt") values ('Advanced high-level synergy', 'disintermediate transparent networks', 9, '2020-09-19T14:02:58Z');
      insert into post (title, text, "authorId", "createdAt") values ('Profound optimizing leverage', 'mesh world-class vortals', 12, '2020-06-28T09:15:06Z');
      insert into post (title, text, "authorId", "createdAt") values ('Centralized secondary monitoring', 'visualize dot-com functionalities', 11, '2020-07-23T11:10:51Z');
      insert into post (title, text, "authorId", "createdAt") values ('Robust solution-oriented moderator', 'drive viral applications', 9, '2020-04-08T02:42:06Z');
      insert into post (title, text, "authorId", "createdAt") values ('Customer-focused responsive monitoring', 'streamline user-centric portals', 12, '2020-03-05T23:37:33Z');
      insert into post (title, text, "authorId", "createdAt") values ('Decentralized context-sensitive orchestration', 'enhance revolutionary systems', 9, '2020-05-22T10:27:17Z');
      insert into post (title, text, "authorId", "createdAt") values ('Synergized 4th generation service-desk', 'recontextualize dynamic infomediaries', 10, '2020-01-07T19:39:19Z');
      insert into post (title, text, "authorId", "createdAt") values ('Inverse empowering time-frame', 'empower cross-media architectures', 11, '2020-11-10T21:25:24Z');
      insert into post (title, text, "authorId", "createdAt") values ('Adaptive regional support', 'whiteboard global niches', 10, '2020-04-06T08:01:23Z');
      insert into post (title, text, "authorId", "createdAt") values ('De-engineered client-driven solution', 'streamline bricks-and-clicks e-services', 11, '2020-09-16T18:26:09Z');
      insert into post (title, text, "authorId", "createdAt") values ('Quality-focused fault-tolerant portal', 'syndicate rich markets', 12, '2020-09-07T11:07:35Z');
      insert into post (title, text, "authorId", "createdAt") values ('Centralized responsive ability', 'evolve integrated infomediaries', 12, '2020-08-29T06:43:05Z');
      insert into post (title, text, "authorId", "createdAt") values ('Triple-buffered systematic time-frame', 'whiteboard cross-media experiences', 11, '2020-05-22T11:28:46Z');
      insert into post (title, text, "authorId", "createdAt") values ('Business-focused client-driven access', 'deliver proactive platforms', 11, '2019-12-30T12:53:38Z');
      insert into post (title, text, "authorId", "createdAt") values ('Public-key leading edge array', 'visualize virtual deliverables', 12, '2020-01-03T17:57:21Z');
      insert into post (title, text, "authorId", "createdAt") values ('Managed background complexity', 'expedite interactive content', 12, '2020-07-08T03:38:53Z');
      insert into post (title, text, "authorId", "createdAt") values ('Multi-layered 6th generation complexity', 'empower end-to-end platforms', 9, '2020-09-17T08:19:45Z');
      insert into post (title, text, "authorId", "createdAt") values ('Focused contextually-based architecture', 'monetize compelling portals', 10, '2020-08-01T02:19:14Z');
      insert into post (title, text, "authorId", "createdAt") values ('Public-key zero tolerance success', 'engage web-enabled niches', 11, '2020-04-17T06:31:09Z');
      insert into post (title, text, "authorId", "createdAt") values ('Streamlined well-modulated firmware', 'implement magnetic infomediaries', 12, '2020-03-31T06:13:22Z');
      insert into post (title, text, "authorId", "createdAt") values ('Balanced multi-tasking function', 'exploit distributed markets', 9, '2020-03-04T15:13:48Z');
      insert into post (title, text, "authorId", "createdAt") values ('Re-contextualized needs-based collaboration', 'incubate compelling users', 10, '2020-07-07T02:33:51Z');
      insert into post (title, text, "authorId", "createdAt") values ('Cross-group didactic task-force', 'streamline dot-com initiatives', 10, '2020-08-08T14:47:53Z');
      insert into post (title, text, "authorId", "createdAt") values ('Universal asymmetric strategy', 'synthesize 24/7 experiences', 9, '2020-08-20T09:09:34Z');
      insert into post (title, text, "authorId", "createdAt") values ('Organized solution-oriented productivity', 'engage e-business portals', 12, '2020-11-30T04:35:03Z');
      insert into post (title, text, "authorId", "createdAt") values ('Triple-buffered 6th generation strategy', 'iterate interactive communities', 12, '2020-05-22T16:54:23Z');
      insert into post (title, text, "authorId", "createdAt") values ('Sharable clear-thinking throughput', 'enhance global initiatives', 11, '2020-12-09T09:41:13Z');
      insert into post (title, text, "authorId", "createdAt") values ('Decentralized upward-trending flexibility', 'integrate global systems', 9, '2020-12-03T14:30:50Z');
      insert into post (title, text, "authorId", "createdAt") values ('Centralized mobile initiative', 'matrix user-centric infomediaries', 11, '2020-04-12T06:30:04Z');
      insert into post (title, text, "authorId", "createdAt") values ('Persevering empowering monitoring', 'implement bleeding-edge action-items', 9, '2020-07-26T04:16:07Z');
      insert into post (title, text, "authorId", "createdAt") values ('Re-engineered regional application', 'harness extensible niches', 10, '2019-12-25T17:11:05Z');
      insert into post (title, text, "authorId", "createdAt") values ('Stand-alone solution-oriented benchmark', 'leverage world-class web services', 11, '2020-05-20T12:09:16Z');
      insert into post (title, text, "authorId", "createdAt") values ('Integrated value-added archive', 'innovate customized communities', 9, '2020-10-21T14:41:17Z');
      insert into post (title, text, "authorId", "createdAt") values ('Assimilated value-added intranet', 'extend visionary e-tailers', 9, '2020-03-27T05:40:40Z');
      insert into post (title, text, "authorId", "createdAt") values ('Enhanced dedicated groupware', 'iterate cross-platform users', 9, '2020-11-15T22:28:21Z');
      insert into post (title, text, "authorId", "createdAt") values ('Synergistic bottom-line infrastructure', 'cultivate revolutionary infrastructures', 9, '2020-11-08T08:10:25Z');
      insert into post (title, text, "authorId", "createdAt") values ('Universal intermediate framework', 'aggregate synergistic relationships', 10, '2020-03-15T10:15:00Z');
      insert into post (title, text, "authorId", "createdAt") values ('Open-architected foreground interface', 'grow vertical solutions', 11, '2020-12-02T22:05:05Z');
      insert into post (title, text, "authorId", "createdAt") values ('Face to face 3rd generation project', 'brand proactive e-markets', 10, '2020-04-21T02:22:31Z');
      insert into post (title, text, "authorId", "createdAt") values ('Mandatory 24/7 secured line', 'innovate user-centric infomediaries', 9, '2020-01-19T05:26:56Z');
      insert into post (title, text, "authorId", "createdAt") values ('Secured neutral leverage', 'harness robust e-commerce', 9, '2020-08-05T02:56:45Z');
      insert into post (title, text, "authorId", "createdAt") values ('Realigned fresh-thinking forecast', 'scale cross-media paradigms', 9, '2020-11-05T08:33:37Z');
      insert into post (title, text, "authorId", "createdAt") values ('Customizable composite help-desk', 'generate 24/7 methodologies', 11, '2020-05-06T12:49:07Z');
      insert into post (title, text, "authorId", "createdAt") values ('Open-architected empowering time-frame', 'innovate B2C methodologies', 12, '2020-01-11T03:37:42Z');
      insert into post (title, text, "authorId", "createdAt") values ('Distributed bandwidth-monitored algorithm', 'optimize rich e-tailers', 9, '2020-10-07T23:54:00Z');
      insert into post (title, text, "authorId", "createdAt") values ('Phased reciprocal installation', 'drive 24/7 applications', 9, '2020-08-27T23:31:10Z');
      
      `)
  }

  public async down(_: QueryRunner): Promise<void> {
  }

}

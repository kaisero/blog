---
title: "Analyzing Firepower logs with pigtail"
summary: "Did you ever run into a problem with Cisco Firepower that left you clueless as…"
date: 2021-04-09T08:24:52
tags: ["Archive"]
aliases: ["/2021/analyzing-firepower-threat-defense-logs"]
---
Did you ever run into a problem with Cisco Firepower that left you clueless as to why your policy deployment is failing? Have you ever asked yourself why your FMC High-Availability is not working correctly or why your new Firewall cannot register with its central manager? Then this is the right post for you. We will look into how pigtail, a CLI logging utility available on both FTD and FMC, can help you figuring out what is happening behind the scenes.

### What exactly is pigtail and where do I find it?

Pigtail is a highly sofisticated log analysis tool that… just kidding, it’s a perl script that basically tails different logfiles, color codes the output for better readability and normalizes logfile timestamps, which is available from SFCLI on FTD and the bash shell on FMC.

{{< alert >}}
**Tip**

Always execute pigtail from bash shell. If you are on FTD you can execute pigtail from SFCLI but not all options are available (only use this option if you do not have admin access)
{{< /alert >}}

Before executing **pigtail** we will need to access the bash shell and change users to root. This can be done by executing the ***expert*** command from SFCLI followed by ***sudo -i***

``` bash
> expert
admin@ftd01:~$ sudo -i
Password:
root@ftd01:~#
```

Now let’s take a look at pigtail and options it provides

<details>
<summary>root@ftd01:~# pigtail –help</summary>

pigtail v1.03 (05/13/2015)
    -----------------------------------------------------------------------------------------
    NAME
        pigtail -- continuously display FireSIGHT management console (and device) logs as the files are written

    SYNOPSIS
        pigtail [-d] [-o] [-h] [-raw] [-n number] [-outfile file] [-history start time end time] [-break regex] [-trigger regex command] [filetype ...]

    DESCRIPTION

    pigtail parses, reformats, and displays the contents of several log files
    to the screen, updating the display whenever additional lines are added to any of
    the log files.  pigtail also colorizes the output so it is easier to discern between
    lines from different log files.  By default it normalizes timestamps, removes some
    extraneous information, and reformats certain lines to improve readability.

         These are the keywords and associated log files that pigtail supports:
                 ACTQ  /var/log/action_queue.log
                 AUTD  /var/log/auth-daemon.log
                 CPAC  /var/log/idhttpsd/access_log
                 CPER  /var/log/idhttpsd/error_log
                 CPLG  /var/log/captive_portal.log
                 DCSM  /var/log/mojo.log
                 DEPL  /var/log/sf/policy_deployment.log
                 HTTP  /var/log/httpd/httpsd_error_log
                 MOJO  /var/log/mojo/mojo.log
                 MSGS  /var/log/messages
                 NGFW  /var/log/ngfwManager.log
                 NGUI  /var/log/cisco/ngfw-onbox.log
                 SERR  /var/log/process_stderr.log
                 SOUT  /var/log/process_stdout.log
                 SSEC  /var/log/connector/connector.log
                 SYDB  /opt/CSCOpx/MDC/log/operation/sydb.out
                 TAPP  /var/log/SSE/sse_telemetry.log
                 TCAT  /opt/CSCOpx/MDC/tomcat/logs/stdout.logs
                 TCLG  /opt/CSCOpx/MDC/log/operation/sftunnel-javaclient.log
                 USMS  /opt/CSCOpx/MDC/log/operation/usmsharedsvcs.log
                 VMSB  /opt/CSCOpx/MDC/log/operation/vmsbesvcs.log
                 VMSS  /opt/CSCOpx/MDC/log/operation/vmssharedsvcs.log

         pigtail has several presets built in for feature-specific debugging.  You can use a preset name in lieu of specifying
         the log keywords.  Using a preset will always create an output file with the name 'pigtail-<preset>-<timestamp>.log'.
         The following presets are supported:
                 captiveportal CPLG CPAC CPER
                 deploy        ACTQ DEPL NGFW NGUI USMS VMSB VMSS TCLG
                 ui            DCSM HTTP MOJO NGUI TCAT
                 all           ACTQ AUTD CPAC CPER CPLG DCSM DEPL HTTP MOJO MSGS NGFW NGUI SERR SOUT SSEC SYDB TAPP TCAT TCLG USMS VMSB VMSS

         pigtail also parses the log lines in order to improve readability.  By default, it normalizes timestamps to
         the format "03-10 20:42:37", right-aligns perl file and line number information, and reformats/omits content
         from the following log files to condense the output:

                 /var/log/action_queue.log
                     Mar 10 20:42:37 papaya ActionQueueScrape.pl[10018]: ...
                        becomes
                     03-10 20:42:37 pid=10018 ...

                 /var/log/httpd/httpsd_error_log
                     [Tue Mar 10 22:04:53.192232 2015] [cgi:error] [pid 24098] [client 10.83.163.71:60408] AH01215: ...
                        becomes
                     03-10 22:04:53 pid=24098 ...

                 /opt/CSCOpx/MDC/tomcat/logs/stdout.logs
                     Omit lines that match:
                         org.restlet.engine.log.LogFilter afterHandle
                         /csm/api/usmaaa/sessionupdate

                 /var/log/sf/policy_deployment.log
                     Mar 10 20:42:37 papaya ActionQueueScrape.pl[10018]: ...
                         becomes
                     03-10 20:42:37 pid=10018 ...

         The options are as follows:

         -h     Displays this documentation
         -d     Condenses dumped structures to only be one line long
         -o     Omits all specified types instead of including them
         -raw   Disables all log parsing and reformatting
         -transparent
                 Supresses the black background on the printed log lines
         -n number
                 On startup, reads the last number lines from each file (default = 10)
         -timeout number
                 On startup, sets timeout for the command to run to number seconds (default = 3600 seconds, 0 means no timeout)
         -outfile file
                 Appends pigtail output to the specified file
         -history start time end time
                 Prints the collated logs from the specified log files, starting at "start time" and ending at
                 "end time".  The format of the times specified can be "mm-dd hh:mm:ss" or can be relative times,
                 such as "15m" or "2h".  If relative times are specified, the start time will be equivalent to
                 (now() - start time), and the end time will be the duration of the logs to be printed.
                 "now" can also be used for the end time.
         -trigger regex command
                 Whenever pigtail encounters the regex, it runs the command and prints the output.
                 You can use captures in the command with {1}, {2}, etc... (up to 5 captures supported)
         -break regex
                 Whenever pigtail encounters the regex, it prints a separator line with the matching text
         -ts Troubleshoots File
                 Runs pigtail on troubleshoot files. This can work only as a combination with history argument.

         If no filetype is specified, all logs are watched for changes.  Typing any characters and pressing ENTER
         will print a separator line to allow you to annotate the display as log lines are being written.

     EXAMPLES

         Deployment debugging
                 pigtail deploy

         UI debugging
                 pigtail ui

         Display the last 100 raw lines of /opt/CSCOpx/MDC/tomcat/logs/stdout.logs
                 pigtail -n 100 -raw TCAT

         Display 10 minutes of /var/log/messages starting at Jan 10 at 2:00pm
                 pigtail MSGS -history "01-10 14:00:00" 10m

         Ignore Apache log
                 pigtail -o HTTP

         Watch for a "start deployment" message and print a separator
                 pigtail ACTQ -break "Started task .+ Domain Policy Deployment"

         Watch for an action queue task to be started and print some information about it
                 pigtail ACTQ -trigger "Started task \(([^)]+)\)" "mysql -u*** -p*** sfsnort -e 'select description, state, type, cost, hidden, create_time, last_state_change, TIMEDIFF(last_state_change, create_time) as length from action_queue where aq_id=\"{1}\" ORDER BY create_time'"

</details>

The help page is quite detailed but can be summed up quickly. Basically you have some filter options that help you tail only specific logs in which you are interested in. For example you can use pigtail TCAT to tail the Tomcat Webserver logs. And that is exactly what we will be doing now, using pigtail to analyze why a REST API call is not working.

### Troubleshooting REST API Calls with Pigtail

{{< alert >}}
If you try to reproduce this example with FMC \>= 6.6.0 you will see that Unprocessable Entity errors have been enhanced to display a more specific error message for some api resources. This has not been the case in previous releases might still apply to more complicated issues related to invalid payloads being sent to the API
{{< /alert >}}

In this example we will try to provision a new network object using curl:

``` bash
curl --location --request POST 'https://fmc.example.com/api/fmc_config/v1/domain/b76ff587-9224-65c7-d2af-000000000000/object/networks' \
--header 'X-auth-access-token: a128aaf2-2103-429d-bf26-f2c844e23dec' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Postman-NetworkObj",
    "description": "Created via Postman",
    "value": "198.18.100.0/241",
    "overridable": "true",
}'

 {"error":{"category":"OTHER","messages":[{"description":"Unprocessable Entity"}],"severity":"ERROR"}}
```

To get more information about the root cause of the error we will re-run the curl command while pigtail is running to capture any additional debugging output from the server side on FMC

    root@fmc:~# pigtail TCAT
     *******************************************************************************************************************
     ** Displaying logs: TCAT                                                                                                               
    *******************************************************************************************************************
     TCAT: 05-01 22:10:24 [ajp-nio-127.0.0.1-9009-exec-6] INFO com.cisco.api.external.rest.common.routing.ExtensionURLFilter - Request for extension URL passed : /domain/b76ff587-9224-65c7-d2af-000000000000/object/networks
     TCAT: 05-01 22:10:24 [ajp-nio-127.0.0.1-9009-exec-6] ERROR com.cisco.api.external.rest.common.resource.ContainerServerResource - Invalid IP Address
     TCAT: 05-01 22:10:24 APIException:Invalid IP Address
    (...)
     TCAT: 05-01 22:16:37 INFO: 172.21.100.127 - - 443 POST /api/fmc_config/v1/domain/b76ff587-9224-65c7-d2af-000000000000/object/networks - 400 - 147 191 https://fmc.example.com PostmanRuntime/7.26.10 -
    (...)

We can clearly see that a **POST** request was processed by the API backend and threw an **APIException** with the additional information **Invalid IP Address**. Upon further inspection we can see that the api payload we sent to FMC was invalid. The value of the new network object is 198.18.100.0/241 which is not a valid ipv4 prefix.

After editing the incorrect api payload we execute the curl statement again:

    curl --location --request POST 'https://fmc.example.com/api/fmc_config/v1/domain/b76ff587-9224-65c7-d2af-000000000000/object/networks' \
    --header 'X-auth-access-token: a128aaf2-2103-429d-bf26-f2c844e23dec' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "name": "Postman-NetworkObj",
        "description": "Created via Postman",
        "value": "198.18.100.0/24",
        "overridable": "true",
    }'

<details>
<summary>Result</summary>

{
        "links": {
            "self": "https://fmc.example.com/api/fmc_config/v1/domain/b76ff587-9224-65c7-d2af-000000000000/object/networks/00505699-76B7-0ed3-0000-081604395212",
            "parent": "https://fmc.example.com/api/fmc_config/v1/domain/b76ff587-9224-65c7-d2af-000000000000/object/networkaddresses"
        },
        "type": "Network",
        "value": "198.18.100.0/24",
        "overridable": true,
        "description": "Created via Postman",
        "id": "00505699-76B7-0ed3-0000-081604395212",
        "name": "Postman-NetworkObj",
        "metadata": {
            "timestamp": 0,
            "lastUser": {
                "name": "api"
            },
            "domain": {
                "name": "Global \\ DEV",
                "id": "b76ff587-9224-65c7-d2af-000000000000",
                "type": "Domain"
            },
            "ipType": "V_4",
            "parentType": "NetworkAddress"
        }

</details>

If we take a look at pigtail again we can also verify that the api call was received and that the return code is 201, indicating that the resource was successfully created:

    TCAT: 05-01 22:20:39 [ajp-nio-127.0.0.1-9009-exec-9] INFO com.cisco.api.external.rest.common.routing.ExtensionURLFilter - Request for extension URL passed : /domain/b76ff587-9224-65c7-d2af-000000000000/object/networks
     TCAT: 05-01 22:20:39 Type value for PolicyObjectEntry - Network
     TCAT: 05-01 22:25:12 INFO: 172.21.100.127 - - 443 POST /api/fmc_config/v1/domain/b76ff587-9224-65c7-d2af-000000000000/object/networks - 201 - 138 1101 https://fmc.example.com PostmanRuntime/7.26.10

## So what’s in it for me – When should I use pigtail for troubleshooting?

Now that we have learned what pigtail is, how it works and looked at a concrete usecase for the only question left is why should you care about it and when is the right time to get down on the CLI and use pigtail?

Pigtail is my goto tool for troubleshooting management plane related issues. Whenever error messages on a graphical user interface are not detailed enough it is helpful to tail your application logfiles and get a glimps of what is happening behind the scenes. Some situations where pigtail might come handy include:

- A failing configuration deployment
- Device registration between FTD and FMC is not working
- FMC High Availability synchronisation is broken
- The LDAP bind connection from a Realm is failing
- FMC UI is unresponsive
- FTD Active/Standby failover is stuck in APP-SYNC state
- etc. etc.
